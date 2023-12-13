import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from '@pancakeswap/ifos'
import { useERC20, useIfoV1Contract } from 'hooks/useContract'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/chains'
import { ifoV1ABI } from 'config/abi/ifoV1'
import useIfoAllowance from '../useIfoAllowance'
import { WalletIfoState, WalletIfoData } from '../../types'

interface UserInfo {
  amount: BigNumber
  claimed: boolean
}

const initialState = {
  isInitialized: false,
  [PoolIds.poolUnlimited]: {
    amountTokenCommittedInLP: BIG_ZERO,
    hasClaimed: false,
    isPendingTx: false,
    offeringAmountInToken: BIG_ZERO,
    refundingAmountInLP: BIG_ZERO,
    taxAmountInLP: BIG_ZERO, // Not used
  },
}

/**
 * Gets all data from an IFO related to a wallet
 */
const useGetWalletIfoData = (ifo: Ifo): WalletIfoData => {
  const [state, setState] = useState<WalletIfoState>(initialState)

  const { address, currency } = ifo
  const { poolUnlimited } = state

  const { address: account } = useAccount()
  const contract = useIfoV1Contract(address)
  const currencyContract = useERC20(currency.address)
  const allowance = useIfoAllowance(currencyContract, address, poolUnlimited.isPendingTx)

  const setPendingTx = (status: boolean) =>
    setState((prevState) => ({
      ...prevState,
      [PoolIds.poolUnlimited]: {
        ...prevState.poolUnlimited,
        isPendingTx: status,
      },
    }))

  const setIsClaimed = () => {
    setState((prevState) => ({
      ...prevState,
      [PoolIds.poolUnlimited]: {
        ...prevState.poolUnlimited,
        hasClaimed: true,
      },
    }))
  }

  const fetchIfoData = useCallback(async () => {
    if (!account) {
      return
    }

    const [offeringAmount, userInfoResponse, refundingAmount] = await publicClient({ chainId: ChainId.BSC }).multicall({
      contracts: [
        {
          address,
          abi: ifoV1ABI,
          functionName: 'getOfferingAmount',
          args: [account],
        },
        {
          address,
          abi: ifoV1ABI,
          functionName: 'userInfo',
          args: [account],
        },
        {
          address,
          abi: ifoV1ABI,
          functionName: 'getRefundingAmount',
          args: [account],
        },
      ],
      allowFailure: false,
    })

    const parsedUserInfo: UserInfo = userInfoResponse
      ? {
          amount: new BigNumber(userInfoResponse[0].toString()),
          claimed: userInfoResponse[1],
        }
      : { amount: BIG_ZERO, claimed: false }

    setState((prevState) => ({
      isInitialized: true,
      [PoolIds.poolUnlimited]: {
        ...prevState.poolUnlimited,
        amountTokenCommittedInLP: parsedUserInfo.amount,
        hasClaimed: parsedUserInfo.claimed,
        offeringAmountInToken: offeringAmount ? new BigNumber(offeringAmount.toString()) : BIG_ZERO,
        refundingAmountInLP: refundingAmount ? new BigNumber(refundingAmount.toString()) : BIG_ZERO,
      },
    }))
  }, [account, address])

  const resetIfoData = useCallback(() => {
    setState(initialState)
  }, [])

  return { ...state, allowance, contract, setPendingTx, setIsClaimed, fetchIfoData, resetIfoData, version: 1 }
}

export default useGetWalletIfoData
