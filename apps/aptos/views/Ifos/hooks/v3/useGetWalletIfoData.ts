/* eslint-disable camelcase */
import { Contract } from '@ethersproject/contracts'
import { useAccount } from '@pancakeswap/awgmi'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'
import { useState, useCallback, useMemo } from 'react'
import { IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA } from 'views/Ifos/constants'
import { computeOfferingAndRefundAmount, computeReleaseAmount } from 'views/Ifos/utils'
import { computeVestingScheduleId } from 'views/Ifos/utils/utils'
// import { fetchCakeVaultUserData } from 'state/pools'
// import { useIfoCredit } from 'state/pools/hooks'
import { WalletIfoState, WalletIfoData } from '../../types'
import { useIfoPool } from '../useIfoPool'
import { useIfoResources } from '../useIfoResources'
import { useIfoUserInfo } from '../useIfoUserInfo'
import { useIfoVestingSchedule } from '../useIfoVestingSchedule'

const initialState = {
  isInitialized: false,
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
export const useGetWalletIfoData = (_ifo: Ifo): WalletIfoData => {
  const { account } = useAccount()

  const [state, setState] = useState<WalletIfoState>(initialState)
  // const credit = useIfoCredit()
  const credit = BIG_ZERO

  const contract = {} as Contract

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

  const vestingScheduleId = useMemo(
    () => (account?.address ? computeVestingScheduleId(account.address, 0) : undefined),
    [account?.address],
  )

  const resources = useIfoResources()
  const pool = useIfoPool()
  const userInfo = useIfoUserInfo()
  const vestingSchedule = useIfoVestingSchedule({ key: vestingScheduleId })

  const fetchIfoData = useCallback(async () => {
    if (!pool.data) {
      return
    }

    const { tax_amount: taxAmountInLP, refunding_amount: refundingAmountInLP } = userInfo.data
      ? computeOfferingAndRefundAmount(userInfo.data, pool.data)
      : {
          tax_amount: BIG_ZERO,
          refunding_amount: BIG_ZERO,
        }
    const vestingComputeReleasableAmount = vestingSchedule.data
      ? computeReleaseAmount(resources[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA], pool.data, vestingSchedule.data)
      : BIG_ZERO

    setState((prevState) => ({
      ...prevState,
      isInitialized: true,
      poolUnlimited: {
        ...prevState.poolUnlimited,
        amountTokenCommittedInLP: userInfo.data ? new BigNumber(userInfo.data.amount) : BIG_ZERO,
        offeringAmountInToken: pool.data ? new BigNumber(pool.data.offering_amount) : BIG_ZERO,
        refundingAmountInLP,
        taxAmountInLP,
        hasClaimed: userInfo.data?.claimed ?? false,
        vestingReleased: vestingSchedule.data ? new BigNumber(vestingSchedule.data.amount_released) : BIG_ZERO,
        vestingAmountTotal: vestingSchedule.data ? new BigNumber(vestingSchedule.data.amount_total) : BIG_ZERO,
        // Not in contract, compute this by checking if there is a vesting schedule for this user.
        isVestingInitialized: !!vestingSchedule.data,
        vestingId: vestingSchedule.data?.pid,
        vestingComputeReleasableAmount,
      },
    }))
  }, [pool, resources, userInfo, vestingSchedule])

  const resetIfoData = useCallback(() => {
    setState({ ...initialState })
  }, [])

  const creditLeftWithNegative = credit.minus(state.poolUnlimited.amountTokenCommittedInLP)

  const ifoCredit = {
    credit,
    creditLeft: BigNumber.maximum(BIG_ZERO, creditLeftWithNegative),
  }

  return { ...state, contract, setPendingTx, setIsClaimed, fetchIfoData, resetIfoData, ifoCredit }
}
