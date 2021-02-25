import { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import { Ifo } from 'config/constants/types'
import { useERC20, useIfoContract } from 'hooks/useContract'
import { useIfoAllowance } from 'hooks/useAllowance'
import makeBatchRequest from 'utils/makeBatchRequest'

export interface UserInfo {
  amount: BigNumber
  claimed: boolean
}

export interface WalletIfoState {
  isPendingTx: boolean
  offeringTokenBalance: BigNumber
  userInfo: UserInfo
}

/**
 * Gets all data from an IFO related to a wallet
 */
const useGetWalletIfoData = (ifo: Ifo) => {
  const [state, setState] = useState<WalletIfoState>({
    isPendingTx: false,
    offeringTokenBalance: new BigNumber(0),
    userInfo: {
      amount: new BigNumber(0),
      claimed: false,
    },
  })

  const { address, currencyAddress } = ifo
  const { isPendingTx } = state

  const { account } = useWallet()
  const contract = useIfoContract(address)
  const currencyContract = useERC20(currencyAddress)
  const allowance = useIfoAllowance(currencyContract, address, isPendingTx)

  const setPendingTx = (status: boolean) =>
    setState((prevState) => ({
      ...prevState,
      isPendingTx: status,
    }))

  const addUserContributedAmount = (amount: BigNumber) => {
    setState((prevState) => ({
      ...prevState,
      userInfo: {
        ...prevState.userInfo,
        amount: prevState.userInfo.amount.plus(amount),
      },
    }))
  }

  const setIsClaimed = () => {
    setState((prevState) => ({
      ...prevState,
      userInfo: {
        ...prevState.userInfo,
        claimed: true,
      },
    }))
  }

  useEffect(() => {
    const fetchIfoData = async () => {
      const [offeringAmount, userInfoResponse] = (await makeBatchRequest([
        contract.methods.getOfferingAmount(account).call,
        contract.methods.userInfo(account).call,
      ])) as [string, UserInfo]

      setState((prevState) => ({
        ...prevState,
        offeringTokenBalance: new BigNumber(offeringAmount),
        userInfo: {
          amount: new BigNumber(userInfoResponse.amount),
          claimed: userInfoResponse.claimed,
        },
      }))
    }

    if (account) {
      fetchIfoData()
    }
  }, [account, contract, setState])

  return { ...state, allowance, contract, setPendingTx, addUserContributedAmount, setIsClaimed }
}

export default useGetWalletIfoData
