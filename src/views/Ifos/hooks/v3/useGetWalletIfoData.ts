import { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'
import { useERC20, useIfoV3Contract } from 'hooks/useContract'
import { multicallv2 } from 'utils/multicall'
import ifoV3Abi from 'config/abi/ifoV3.json'
import { fetchCakeVaultUserData } from 'state/pools'
import { useAppDispatch } from 'state'
import { useIfoCredit } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
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
    vestingcomputeReleasableAmount: BIG_ZERO,
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
    vestingcomputeReleasableAmount: BIG_ZERO,
  },
}

/**
 * Gets all data from an IFO related to a wallet
 */
const useGetWalletIfoData = (ifo: Ifo): WalletIfoData => {
  const [state, setState] = useState<WalletIfoState>(initialState)
  const dispatch = useAppDispatch()
  const credit = useIfoCredit()

  const { address, currency, version } = ifo

  const { account } = useWeb3React()
  const contract = useIfoV3Contract(address)
  const currencyContract = useERC20(currency.address, false)
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
    const ifoCalls = ['viewUserInfo', 'viewUserOfferingAndRefundingAmountsForPools'].map((method) => ({
      address,
      name: method,
      params: [account, [0, 1]],
    }))

    let basicId = null
    let unlimitedId = null
    if (version >= 3.2) {
      const [[basicIdData], [unlimitedIdData]] = await multicallv2(
        ifoV3Abi,
        [
          { address, name: 'computeVestingScheduleIdForAddressAndPid', params: [account, 0] },
          { address, name: 'computeVestingScheduleIdForAddressAndPid', params: [account, 1] },
        ],
        { requireSuccess: false },
      )

      basicId = basicIdData
      unlimitedId = unlimitedIdData
    }

    const ifov3Calls =
      version >= 3.1
        ? [
            {
              address,
              name: 'isQualifiedNFT',
              params: [account],
            },
            {
              address,
              name: 'isQualifiedPoints',
              params: [account],
            },
            version === 3.2 && {
              address,
              name: 'getVestingSchedule',
              params: [basicId],
            },
            version === 3.2 && {
              address,
              name: 'getVestingSchedule',
              params: [unlimitedId],
            },
            version === 3.2 && {
              address,
              name: 'computeReleasableAmount',
              params: [basicId],
            },
            version === 3.2 && {
              address,
              name: 'computeReleasableAmount',
              params: [unlimitedId],
            },
          ].filter(Boolean)
        : []

    dispatch(fetchCakeVaultUserData({ account }))

    const [
      userInfo,
      amounts,
      isQualifiedNFT,
      isQualifiedPoints,
      basicSchedule,
      unlimitedSchedule,
      basicReleasableAmount,
      unlimitedReleasableAmount,
    ] = await multicallv2(ifoV3Abi, [...ifoCalls, ...ifov3Calls], { requireSuccess: false })

    setState((prevState) => ({
      ...prevState,
      isInitialized: true,
      poolBasic: {
        ...prevState.poolBasic,
        amountTokenCommittedInLP: new BigNumber(userInfo[0][0].toString()),
        offeringAmountInToken: new BigNumber(amounts[0][0][0].toString()),
        refundingAmountInLP: new BigNumber(amounts[0][0][1].toString()),
        taxAmountInLP: new BigNumber(amounts[0][0][2].toString()),
        hasClaimed: userInfo[1][0],
        isQualifiedNFT: isQualifiedNFT ? isQualifiedNFT[0] : false,
        isQualifiedPoints: isQualifiedPoints ? isQualifiedPoints[0] : false,
        vestingReleased: basicSchedule ? new BigNumber(basicSchedule[0].released.toString()) : BIG_ZERO,
        vestingAmountTotal: basicSchedule ? new BigNumber(basicSchedule[0].amountTotal.toString()) : BIG_ZERO,
        isVestingInitialized: basicSchedule ? basicSchedule[0].isVestingInitialized : false,
        vestingId: basicId ? basicId.toString() : '0',
        vestingcomputeReleasableAmount: basicReleasableAmount
          ? new BigNumber(basicReleasableAmount.toString())
          : BIG_ZERO,
      },
      poolUnlimited: {
        ...prevState.poolUnlimited,
        amountTokenCommittedInLP: new BigNumber(userInfo[0][1].toString()),
        offeringAmountInToken: new BigNumber(amounts[0][1][0].toString()),
        refundingAmountInLP: new BigNumber(amounts[0][1][1].toString()),
        taxAmountInLP: new BigNumber(amounts[0][1][2].toString()),
        hasClaimed: userInfo[1][1],
        vestingReleased: unlimitedSchedule ? new BigNumber(unlimitedSchedule[0].released.toString()) : BIG_ZERO,
        vestingAmountTotal: unlimitedSchedule ? new BigNumber(unlimitedSchedule[0].amountTotal.toString()) : BIG_ZERO,
        isVestingInitialized: unlimitedSchedule ? unlimitedSchedule[0].isVestingInitialized : false,
        vestingId: unlimitedId ? unlimitedId.toString() : '0',
        vestingcomputeReleasableAmount: unlimitedReleasableAmount
          ? new BigNumber(unlimitedReleasableAmount.toString())
          : BIG_ZERO,
      },
    }))
  }, [account, address, dispatch, version])

  const resetIfoData = useCallback(() => {
    setState({ ...initialState })
  }, [])

  const creditLeftWithNegative = credit.minus(state.poolUnlimited.amountTokenCommittedInLP)

  const ifoCredit = {
    credit,
    creditLeft: BigNumber.maximum(BIG_ZERO, creditLeftWithNegative),
  }

  return { ...state, allowance, contract, setPendingTx, setIsClaimed, fetchIfoData, resetIfoData, ifoCredit }
}

export default useGetWalletIfoData
