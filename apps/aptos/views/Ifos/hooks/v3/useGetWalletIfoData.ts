/* eslint-disable camelcase */
import { Contract } from '@ethersproject/contracts'
import { useAccount } from '@pancakeswap/awgmi'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'
import { useState, useCallback } from 'react'
import { RootObject as IFOPool } from 'views/Ifos/generated/IFOPool'
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

  const [state, setState] = useState<WalletIfoState>(initialState)

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

  const userInfo = useIfoUserInfo()
  const vestingCharacteristics = useVestingCharacteristics()

  const handleOnSettled = useCallback(
    (data?: IFOPool) => {
      if (!account && state.isInitialized) {
        setState(initialState)
        return
      }

      if (data) {
        const { tax_amount: taxAmountInLP, refunding_amount: refundingAmountInLP } = userInfo.data
          ? computeOfferingAndRefundAmount(userInfo.data, data)
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
      }
    },
    [account, state, userInfo, vestingCharacteristics],
  )

  useIfoPool({ onSettled: handleOnSettled })

  return { ...state, contract, setPendingTx, setIsClaimed }
}
