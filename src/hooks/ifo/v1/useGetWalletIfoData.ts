import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'
import { useERC20, useIfoV1Contract } from 'hooks/useContract'
import { useIfoAllowance } from 'hooks/useAllowance'
import makeBatchRequest from 'utils/makeBatchRequest'
import { getAddress } from 'utils/addressHelpers'
import { WalletIfoState, WalletIfoData } from '../types'

interface UserInfo {
  amount: BigNumber
  claimed: boolean
}

/**
 * Gets all data from an IFO related to a wallet
 */
const useGetWalletIfoData = (ifo: Ifo): WalletIfoData => {
  const [state, setState] = useState<WalletIfoState>({
    [PoolIds.poolUnlimited]: {
      amountTokenCommittedInLP: new BigNumber(0),
      hasClaimed: false,
      isPendingTx: false,
      offeringAmountInToken: new BigNumber(0),
      refundingAmountInLP: new BigNumber(0),
      taxAmountInLP: new BigNumber(0), // Not used
    },
  })

  const { address, currency } = ifo
  const { poolUnlimited } = state

  const { account } = useWeb3React()
  const contract = useIfoV1Contract(address)
  const currencyContract = useERC20(getAddress(currency.address))
  const allowance = useIfoAllowance(currencyContract, address, poolUnlimited.isPendingTx)

  const setPendingTx = (status: boolean) =>
    setState((prevState) => ({
      [PoolIds.poolUnlimited]: {
        ...prevState.poolUnlimited,
        isPendingTx: status,
      },
    }))

  const setIsClaimed = () => {
    setState((prevState) => ({
      [PoolIds.poolUnlimited]: {
        ...prevState.poolUnlimited,
        hasClaimed: true,
      },
    }))
  }

  useEffect(() => {
    const fetchIfoData = async () => {
      const [offeringAmount, userInfoResponse, refundingAmount] = (await makeBatchRequest([
        contract.methods.getOfferingAmount(account).call,
        contract.methods.userInfo(account).call,
        contract.methods.getRefundingAmount(account).call,
      ])) as [string, UserInfo, string]

      setState((prevState) => ({
        [PoolIds.poolUnlimited]: {
          ...prevState.poolUnlimited,
          amountTokenCommittedInLP: new BigNumber(userInfoResponse.amount),
          hasClaimed: userInfoResponse.claimed,
          offeringAmountInToken: new BigNumber(offeringAmount),
          refundingAmountInLP: new BigNumber(refundingAmount),
        },
      }))
    }

    if (account) {
      fetchIfoData()
    }
  }, [account, contract, setState])

  return { ...state, allowance, contract, setPendingTx, addUserContributedAmount: () => null, setIsClaimed }
}

export default useGetWalletIfoData
