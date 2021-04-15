import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'
import { useERC20, useIfoV2Contract } from 'hooks/useContract'
import { useIfoAllowance } from 'hooks/useAllowance'
import useRefresh from 'hooks/useRefresh'
import makeBatchRequest from 'utils/makeBatchRequest'
import { getAddress } from 'utils/addressHelpers'
import { WalletIfoState, WalletIfoData } from './types'

/**
 * Gets all data from an IFO related to a wallet
 */
const useGetWalletIfoData = (ifo: Ifo): WalletIfoData => {
  const { fastRefresh } = useRefresh()
  const [state, setState] = useState<WalletIfoState>({
    poolBasic: {
      amountTokenCommittedInLP: new BigNumber(0),
      offeringAmountInToken: new BigNumber(0),
      refundingAmountInLP: new BigNumber(0),
      taxAmountInLP: new BigNumber(0),
      hasClaimed: false,
      isPendingTx: false,
    },
    poolUnlimited: {
      amountTokenCommittedInLP: new BigNumber(0),
      offeringAmountInToken: new BigNumber(0),
      refundingAmountInLP: new BigNumber(0),
      taxAmountInLP: new BigNumber(0),
      hasClaimed: false,
      isPendingTx: false,
    },
  })

  const { address, currency } = ifo

  const { account } = useWeb3React()
  const contract = useIfoV2Contract(address)
  const currencyContract = useERC20(getAddress(currency.address))
  const allowance = useIfoAllowance(currencyContract, address)

  const setPendingTx = (status: boolean, poolId: PoolIds) =>
    setState((prevState) => ({
      ...prevState,
      [poolId]: {
        ...prevState[poolId],
        isPendingTx: status,
      },
    }))

  const addUserContributedAmount = async (amount: BigNumber, poolId: PoolIds) => {
    const [[offeringAmountInToken]] = await contract.methods
      .viewUserOfferingAndRefundingAmountsForPools(account, [poolId === PoolIds.poolBasic ? 0 : 1])
      .call()
    setState((prevState) => ({
      ...prevState,
      [poolId]: {
        ...prevState[poolId],
        amountTokenCommittedInLP: prevState[poolId].amountTokenCommittedInLP.plus(amount),
        offeringAmountInToken,
      },
    }))
  }

  const setIsClaimed = (poolId: PoolIds) => {
    setState((prevState) => ({
      ...prevState,
      [poolId]: {
        ...prevState[poolId],
        hasClaimed: true,
      },
    }))
  }

  useEffect(() => {
    const fetchIfoData = async () => {
      const [userInfo, amounts] = await makeBatchRequest([
        contract.methods.viewUserInfo(account, [0, 1]).call,
        contract.methods.viewUserOfferingAndRefundingAmountsForPools(account, [0, 1]).call,
      ])

      setState((prevState) => ({
        ...prevState,
        poolBasic: {
          ...prevState.poolBasic,
          amountTokenCommittedInLP: new BigNumber(userInfo[0][0]),
          offeringAmountInToken: new BigNumber(amounts[0][0]),
          refundingAmountInLP: new BigNumber(amounts[0][1]),
          taxAmountInLP: new BigNumber(amounts[0][2]),
          hasClaimed: userInfo[1][0],
        },
        poolUnlimited: {
          ...prevState.poolUnlimited,
          amountTokenCommittedInLP: new BigNumber(userInfo[0][1]),
          offeringAmountInToken: new BigNumber(amounts[1][0]),
          refundingAmountInLP: new BigNumber(amounts[1][1]),
          taxAmountInLP: new BigNumber(amounts[1][2]),
          hasClaimed: userInfo[1][1],
        },
      }))
    }

    if (account) {
      fetchIfoData()
    }
  }, [account, contract, fastRefresh])

  return { ...state, allowance, contract, setPendingTx, addUserContributedAmount, setIsClaimed }
}

export default useGetWalletIfoData
