import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'
import { useERC20, useIfoV3Contract } from 'hooks/useContract'
import { fetchCakeVaultUserData } from 'state/pools'
import { useAppDispatch } from 'state'
import { useIfoCredit } from 'state/pools/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { ifoV3ABI } from 'config/abi/ifoV3'

import useIfoAllowance from '../useIfoAllowance'
import { WalletIfoState, WalletIfoData } from '../../types'

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
  const [state, setState] = useState<WalletIfoState>(initialState)
  const dispatch = useAppDispatch()
  const credit = useIfoCredit()
  const { chainId } = useActiveChainId()

  const { address, currency, version } = ifo

  const { address: account } = useAccount()
  const contract = useIfoV3Contract(address)
  const currencyContract = useERC20(currency.address)
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
    const bscClient = publicClient({ chainId: ChainId.BSC })

    const [userInfo, amounts] = await bscClient.multicall({
      contracts: [
        {
          address,
          abi: ifoV3ABI,
          functionName: 'viewUserInfo',
          args: [account, [0, 1]],
        },
        {
          address,
          abi: ifoV3ABI,
          functionName: 'viewUserOfferingAndRefundingAmountsForPools',
          args: [account, [0, 1]],
        },
      ],
      allowFailure: false,
    })

    let basicId = null
    let unlimitedId = null
    if (version >= 3.2) {
      const [basicIdDataResult, unlimitedIdDataResult] = await bscClient.multicall({
        contracts: [
          {
            address,
            abi: ifoV3ABI,
            functionName: 'computeVestingScheduleIdForAddressAndPid',
            args: [account, 0n],
          },
          {
            address,
            abi: ifoV3ABI,
            functionName: 'computeVestingScheduleIdForAddressAndPid',
            args: [account, 1n],
          },
        ],
      })

      basicId = basicIdDataResult.result
      unlimitedId = unlimitedIdDataResult.result
    }

    let [
      isQualifiedNFT,
      isQualifiedPoints,
      basicSchedule,
      unlimitedSchedule,
      basicReleasableAmount,
      unlimitedReleasableAmount,
    ] = [false, false, null, null, null, null]

    if (version >= 3.1) {
      const [
        isQualifiedNFTResult,
        isQualifiedPointsResult,
        basicScheduleResult,
        unlimitedScheduleResult,
        basicReleasableAmountResult,
        unlimitedReleasableAmountResult,
      ] = await bscClient.multicall({
        contracts: [
          {
            address,
            abi: ifoV3ABI,
            functionName: 'isQualifiedNFT',
            args: [account],
          },
          {
            abi: ifoV3ABI,
            address,
            functionName: 'isQualifiedPoints',
            args: [account],
          },
          {
            abi: ifoV3ABI,
            address,
            functionName: 'getVestingSchedule',
            args: [basicId],
          },
          {
            abi: ifoV3ABI,
            address,
            functionName: 'getVestingSchedule',
            args: [unlimitedId],
          },
          {
            abi: ifoV3ABI,
            address,
            functionName: 'computeReleasableAmount',
            args: [basicId],
          },
          {
            abi: ifoV3ABI,
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

    dispatch(fetchCakeVaultUserData({ account, chainId }))

    setState((prevState) => ({
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
    }))
  }, [account, address, dispatch, version, chainId])

  const resetIfoData = useCallback(() => {
    setState({ ...initialState })
  }, [])

  const creditLeftWithNegative = credit.minus(state.poolUnlimited.amountTokenCommittedInLP)

  const ifoCredit = {
    credit,
    creditLeft: BigNumber.maximum(BIG_ZERO, creditLeftWithNegative),
  }

  return {
    ...state,
    allowance,
    contract,
    setPendingTx,
    setIsClaimed,
    fetchIfoData,
    resetIfoData,
    ifoCredit,
    version: 3,
  }
}

export default useGetWalletIfoData
