/* eslint-disable camelcase */
import { useAccount } from '@pancakeswap/awgmi'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'
import { useState, useMemo } from 'react'
import { computeOfferingAndRefundAmount } from 'views/Ifos/utils'
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
  const { account } = useAccount()
  const pool = useIfoPool()

  const [state, setState] = useState<WalletIfoState>(initialState)

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

  const { data: userInfo } = useIfoUserInfo(pool?.type)
  const vestingCharacteristics = useVestingCharacteristics()

  const finalState = useMemo(() => {
    if (!account || !pool?.data) {
      return initialState
    }

    const { tax_amount: taxAmountInLP, refunding_amount: refundingAmountInLP } = userInfo?.data
      ? computeOfferingAndRefundAmount(userInfo.data.amount, pool?.data)
      : {
          tax_amount: BIG_ZERO,
          refunding_amount: BIG_ZERO,
        }

    return {
      ...state,
      isInitialized: true,
      poolUnlimited: {
        ...state.poolUnlimited,
        ...vestingCharacteristics,
        amountTokenCommittedInLP: userInfo?.data ? new BigNumber(userInfo?.data.amount) : BIG_ZERO,
        hasClaimed: userInfo?.data?.claimed ?? false,
        refundingAmountInLP,
        taxAmountInLP,
      },
    }
  }, [account, userInfo, pool, vestingCharacteristics, state])

  return { ...finalState, setPendingTx, setIsClaimed }
}
