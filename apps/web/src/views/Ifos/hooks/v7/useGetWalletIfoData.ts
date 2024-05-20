import { useState, useCallback, useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { Address } from 'viem'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds, ifoV7ABI } from '@pancakeswap/ifos'
import { useERC20, useIfoV7Contract } from 'hooks/useContract'
import { fetchCakeVaultUserData } from 'state/pools'
import { useAppDispatch } from 'state'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { publicClient } from 'utils/wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'

import useIfoAllowance from '../useIfoAllowance'
import { WalletIfoState, WalletIfoData } from '../../types'
import { useIfoSourceChain } from '../useIfoSourceChain'
import { useIfoCredit } from '../useIfoCredit'

const initialState = {
  isInitialized: false,
  poolBasic: {
    amountTokenCommittedInLP: BIG_ZERO,
    offeringAmountInToken: BIG_ZERO,
    refundingAmountInLP: BIG_ZERO,
    taxAmountInLP: BIG_ZERO,
    hasClaimed: false,
    isPendingTx: false,
    vestingReleased: BIG_ZERO,
    vestingAmountTotal: BIG_ZERO,
    isVestingInitialized: false,
    vestingId: '0',
    vestingComputeReleasableAmount: BIG_ZERO,
  },
  poolUnlimited: {
    amountTokenCommittedInLP: BIG_ZERO,
    offeringAmountInToken: BIG_ZERO,
    refundingAmountInLP: BIG_ZERO,
    taxAmountInLP: BIG_ZERO,
    hasClaimed: false,
    isPendingTx: false,
    vestingReleased: BIG_ZERO,
    vestingAmountTotal: BIG_ZERO,
    isVestingInitialized: false,
    vestingId: '0',
    vestingComputeReleasableAmount: BIG_ZERO,
  },
}

/**
 * Gets all data from an IFO related to a wallet
 */
const useGetWalletIfoData = (ifo: Ifo): WalletIfoData => {
  const { chainId: currenctChainId } = useActiveChainId()
  const [state, setState] = useState<WalletIfoState>(initialState)
  const dispatch = useAppDispatch()
  const { chainId } = ifo
  const creditAmount = useIfoCredit({ chainId, ifoAddress: ifo.address })
  const credit = useMemo(
    () => (creditAmount && BigNumber(creditAmount.quotient.toString())) ?? BIG_ZERO,
    [creditAmount],
  )
  const sourceChain = useIfoSourceChain(chainId)

  const { address, currency, version } = ifo

  const { address: account } = useAccount()
  const contract = useIfoV7Contract(address, { chainId })
  const currencyContract = useERC20(currency.address, { chainId })
  const allowance = useIfoAllowance(currencyContract, address)

  const setPendingTx = (status: boolean, poolId: PoolIds) =>
    setState((prevState) => ({
      ...prevState,
      [poolId]: {
        ...prevState[poolId],
        isPendingTx: status,
      },
    }))

  const setIsClaimed = (poolId: PoolIds) => {
    setState((prevState) => ({
      ...prevState,
      [poolId]: {
        ...prevState[poolId],
        hasClaimed: true,
      },
    }))
  }

  const fetchIfoData = useCallback(async () => {
    if (!account) {
      return
    }
    const client = publicClient({ chainId })

    const [userInfo, amounts] = await client.multicall({
      contracts: [
        {
          address,
          abi: ifoV7ABI,
          functionName: 'viewUserInfo',
          args: [account, [0, 1]],
        },
        {
          address,
          abi: ifoV7ABI,
          functionName: 'viewUserOfferingAndRefundingAmountsForPools',
          args: [account, [0, 1]],
        },
      ],
      allowFailure: false,
    })

    let basicId: Address | null = null
    let unlimitedId: Address | null = null
    if (version >= 3.2) {
      const [basicIdDataResult, unlimitedIdDataResult] = await client.multicall({
        contracts: [
          {
            address,
            abi: ifoV7ABI,
            functionName: 'computeVestingScheduleIdForAddressAndPid',
            args: [account, 0n],
          },
          {
            address,
            abi: ifoV7ABI,
            functionName: 'computeVestingScheduleIdForAddressAndPid',
            args: [account, 1n],
          },
        ],
      })

      basicId = basicIdDataResult.result ?? null
      unlimitedId = unlimitedIdDataResult.result ?? null
    }

    basicId = basicId || '0x'
    unlimitedId = unlimitedId || '0x'

    let [
      isQualifiedNFT,
      isQualifiedPoints,
      basicSchedule,
      unlimitedSchedule,
      basicReleasableAmount,
      unlimitedReleasableAmount,
    ]: [boolean | undefined, boolean | undefined, any | null, any | null, any | null, any | null] = [
      false,
      false,
      null,
      null,
      null,
      null,
    ]

    if (version >= 3.1) {
      const [
        isQualifiedNFTResult,
        isQualifiedPointsResult,
        basicScheduleResult,
        unlimitedScheduleResult,
        basicReleasableAmountResult,
        unlimitedReleasableAmountResult,
      ] = await client.multicall({
        contracts: [
          {
            address,
            abi: ifoV7ABI,
            functionName: 'isQualifiedNFT',
            args: [account],
          },
          {
            abi: ifoV7ABI,
            address,
            functionName: 'isQualifiedPoints',
            args: [account],
          },
          {
            abi: ifoV7ABI,
            address,
            functionName: 'getVestingSchedule',
            args: [basicId],
          },
          {
            abi: ifoV7ABI,
            address,
            functionName: 'getVestingSchedule',
            args: [unlimitedId],
          },
          {
            abi: ifoV7ABI,
            address,
            functionName: 'computeReleasableAmount',
            args: [basicId],
          },
          {
            abi: ifoV7ABI,
            address,
            functionName: 'computeReleasableAmount',
            args: [unlimitedId],
          },
        ],
        allowFailure: true,
      })

      isQualifiedNFT = isQualifiedNFTResult.result
      isQualifiedPoints = isQualifiedPointsResult.result
      basicSchedule = basicScheduleResult.result
      unlimitedSchedule = unlimitedScheduleResult.result
      basicReleasableAmount = basicReleasableAmountResult.result
      unlimitedReleasableAmount = unlimitedReleasableAmountResult.result
    }

    dispatch(fetchCakeVaultUserData({ account, chainId: sourceChain }))

    setState(
      (prevState) =>
        ({
          ...prevState,
          isInitialized: true,
          poolBasic: {
            ...prevState.poolBasic,
            amountTokenCommittedInLP: new BigNumber(userInfo[0][0].toString()),
            offeringAmountInToken: new BigNumber(amounts[0][0].toString()),
            refundingAmountInLP: new BigNumber(amounts[0][1].toString()),
            taxAmountInLP: new BigNumber(amounts[0][2].toString()),
            hasClaimed: userInfo[1][0],
            isQualifiedNFT,
            isQualifiedPoints,
            vestingReleased: basicSchedule ? new BigNumber(basicSchedule.released.toString()) : BIG_ZERO,
            vestingAmountTotal: basicSchedule ? new BigNumber(basicSchedule.amountTotal.toString()) : BIG_ZERO,
            isVestingInitialized: basicSchedule ? basicSchedule.isVestingInitialized : false,
            vestingId: basicId ? basicId.toString() : '0',
            vestingComputeReleasableAmount: basicReleasableAmount
              ? new BigNumber(basicReleasableAmount.toString())
              : BIG_ZERO,
          },
          poolUnlimited: {
            ...prevState.poolUnlimited,
            amountTokenCommittedInLP: new BigNumber(userInfo[0][1].toString()),
            offeringAmountInToken: new BigNumber(amounts[1][0].toString()),
            refundingAmountInLP: new BigNumber(amounts[1][1].toString()),
            taxAmountInLP: new BigNumber(amounts[1][2].toString()),
            hasClaimed: userInfo[1][1],
            vestingReleased: unlimitedSchedule ? new BigNumber(unlimitedSchedule.released.toString()) : BIG_ZERO,
            vestingAmountTotal: unlimitedSchedule ? new BigNumber(unlimitedSchedule.amountTotal.toString()) : BIG_ZERO,
            isVestingInitialized: unlimitedSchedule ? unlimitedSchedule.isVestingInitialized : false,
            vestingId: unlimitedId ? unlimitedId.toString() : '0',
            vestingComputeReleasableAmount: unlimitedReleasableAmount
              ? new BigNumber(unlimitedReleasableAmount.toString())
              : BIG_ZERO,
          },
        } as any),
    )
  }, [account, address, dispatch, version, chainId, sourceChain])

  const resetIfoData = useCallback(() => {
    setState({ ...initialState })
  }, [])

  const creditLeftWithNegative = credit.minus(state.poolUnlimited.amountTokenCommittedInLP)

  const ifoCredit = {
    credit,
    creditLeft: BigNumber.maximum(BIG_ZERO, creditLeftWithNegative),
  }

  useEffect(() => resetIfoData(), [currenctChainId, account, resetIfoData])

  return {
    ...state,
    allowance,
    contract,
    setPendingTx,
    setIsClaimed,
    fetchIfoData,
    resetIfoData,
    ifoCredit,
    version: 7,
  }
}

export default useGetWalletIfoData
