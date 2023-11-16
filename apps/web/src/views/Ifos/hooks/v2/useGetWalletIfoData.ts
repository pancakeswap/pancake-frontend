import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from '@pancakeswap/ifos'
import { useERC20, useIfoV2Contract } from 'hooks/useContract'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/chains'
import { ifoV2ABI } from 'config/abi/ifoV2'
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
  },
  poolUnlimited: {
    amountTokenCommittedInLP: BIG_ZERO,
    offeringAmountInToken: BIG_ZERO,
    refundingAmountInLP: BIG_ZERO,
    taxAmountInLP: BIG_ZERO,
    hasClaimed: false,
    isPendingTx: false,
  },
}

/**
 * Gets all data from an IFO related to a wallet
 */
const useGetWalletIfoData = (ifo: Ifo): WalletIfoData => {
  const [state, setState] = useState<WalletIfoState>(initialState)

  const { address, currency } = ifo

  const { address: account } = useAccount()
  const contract = useIfoV2Contract(address)
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

    if (!account) {
      return
    }
    const [userInfo, amounts] = await bscClient.multicall({
      contracts: [
        {
          address,
          abi: ifoV2ABI,
          functionName: 'viewUserInfo',
          args: [account, [0, 1]],
        },
        {
          address,
          abi: ifoV2ABI,
          functionName: 'viewUserOfferingAndRefundingAmountsForPools',
          args: [account, [0, 1]],
        },
      ],
      allowFailure: false,
    })

    setState(
      (prevState) =>
        ({
          ...prevState,
          isInitialized: true,
          poolBasic: {
            ...prevState.poolBasic,
            amountTokenCommittedInLP: new BigNumber(userInfo[0][0].toString()),
            offeringAmountInToken: new BigNumber(amounts[0][0].toString()),
            refundingAmountInLP: new BigNumber(amounts[0][1].toString()),
            taxAmountInLP: new BigNumber(amounts[0][2].toString()),
            hasClaimed: userInfo[1][0],
          },
          poolUnlimited: {
            ...prevState.poolUnlimited,
            amountTokenCommittedInLP: new BigNumber(userInfo[0][1].toString()),
            offeringAmountInToken: new BigNumber(amounts[1][0].toString()),
            refundingAmountInLP: new BigNumber(amounts[1][1].toString()),
            taxAmountInLP: new BigNumber(amounts[1][2].toString()),
            hasClaimed: userInfo[1][1],
          },
        } as any),
    )
  }, [account, address])

  const resetIfoData = useCallback(() => {
    setState({ ...initialState })
  }, [])

  return { ...state, allowance, contract, setPendingTx, setIsClaimed, fetchIfoData, resetIfoData, version: 2 }
}

export default useGetWalletIfoData
