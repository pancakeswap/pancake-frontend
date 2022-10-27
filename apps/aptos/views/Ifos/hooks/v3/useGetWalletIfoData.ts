/* eslint-disable camelcase */
import { Contract } from '@ethersproject/contracts'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'
import { useState, useCallback } from 'react'
import { computeOfferingAndRefundAmount } from 'views/Ifos/utils'
// import { fetchCakeVaultUserData } from 'state/pools'
// import { useIfoCredit } from 'state/pools/hooks'
import { WalletIfoState, WalletIfoData } from '../../types'
import { useIfoPool } from '../useIfoPool'
import { useIfoUserInfo } from '../useIfoUserInfo'
import { useVestingCharacteristics } from '../vesting/useVestingCharacteristics'

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

  const pool = useIfoPool()
  const userInfo = useIfoUserInfo()
  const vestingCharacteristics = useVestingCharacteristics()

  const fetchIfoData = useCallback(async () => {
    const { tax_amount: taxAmountInLP, refunding_amount: refundingAmountInLP } =
      pool.data && userInfo.data
        ? computeOfferingAndRefundAmount(userInfo.data, pool.data)
        : {
            tax_amount: BIG_ZERO,
            refunding_amount: BIG_ZERO,
          }

    setState((prevState) => ({
      ...prevState,
      isInitialized: true,
      poolUnlimited: {
        ...prevState.poolUnlimited,
        ...vestingCharacteristics,
        amountTokenCommittedInLP: userInfo.data ? new BigNumber(userInfo.data.amount) : BIG_ZERO,
        hasClaimed: userInfo.data?.claimed ?? false,
        refundingAmountInLP,
        taxAmountInLP,
      },
    }))
  }, [pool, userInfo, vestingCharacteristics])

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
