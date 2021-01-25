import React, { createContext, useEffect, useRef, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useBlock from 'hooks/useBlock'
import useGetWalletNfts, { NftMap } from 'hooks/useGetWalletNfts'
import { getRabbitMintingFarmAddress } from 'utils/addressHelpers'
import { getPancakeRabbitContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import rabbitmintingfarm from 'config/abi/rabbitmintingfarm.json'

const rabbitMintingFarmAddress = getRabbitMintingFarmAddress()

type State = {
  isInitialized: boolean
  canClaim: boolean
  hasClaimed: boolean
  countBunniesBurnt: number
  endBlockNumber: number
  startBlockNumber: number
  totalSupplyDistributed: number
  currentDistributedSupply: number
  balanceOf: number
}

type Context = {
  nfts: NftMap
  canBurnNft: boolean
  getTokenIds: (bunnyId: number) => number[]
  reInitialize: () => void
} & State

export const NftProviderContext = createContext<Context | null>(null)

const NftProvider: React.FC = ({ children }) => {
  const isMounted = useRef(true)
  const [state, setState] = useState<State>({
    isInitialized: false,
    canClaim: false,
    hasClaimed: false,
    countBunniesBurnt: 0,
    startBlockNumber: 0,
    endBlockNumber: 0,
    totalSupplyDistributed: 0,
    currentDistributedSupply: 0,
    balanceOf: 0,
  })
  const { account } = useWallet()
  const currentBlock = useBlock()
  const { nfts: nftList } = useGetWalletNfts()
  const { isInitialized } = state

  // Static data
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const [
          startBlockNumberArr,
          endBlockNumberArr,
          countBunniesBurntArr,
          totalSupplyDistributedArr,
          currentDistributedSupplyArr,
        ] = await multicall(rabbitmintingfarm, [
          { address: rabbitMintingFarmAddress, name: 'startBlockNumber' },
          { address: rabbitMintingFarmAddress, name: 'endBlockNumber' },
          { address: rabbitMintingFarmAddress, name: 'countBunniesBurnt' },
          { address: rabbitMintingFarmAddress, name: 'totalSupplyDistributed' },
          { address: rabbitMintingFarmAddress, name: 'currentDistributedSupply' },
        ])

        // TODO: Figure out why these are coming back as arrays
        const [startBlockNumber]: [BigNumber] = startBlockNumberArr
        const [endBlockNumber]: [BigNumber] = endBlockNumberArr
        const [countBunniesBurnt]: [BigNumber] = countBunniesBurntArr
        const [totalSupplyDistributed]: [BigNumber] = totalSupplyDistributedArr
        const [currentDistributedSupply]: [BigNumber] = currentDistributedSupplyArr

        setState((prevState) => ({
          ...prevState,
          isInitialized: true,
          countBunniesBurnt: countBunniesBurnt.toNumber(),
          startBlockNumber: startBlockNumber.toNumber(),
          endBlockNumber: endBlockNumber.toNumber(),
          currentDistributedSupply: currentDistributedSupply.toNumber(),
          totalSupplyDistributed: totalSupplyDistributed.toNumber(),
        }))
      } catch (error) {
        console.error('an error occured', error)
      }
    }

    fetchContractData()
  }, [isInitialized, setState])

  // Data from the contract that needs an account
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const pancakeRabbitsContract = getPancakeRabbitContract()
        const [canClaimArr, hasClaimedArr] = await multicall(rabbitmintingfarm, [
          { address: rabbitMintingFarmAddress, name: 'canClaim', params: [account] },
          { address: rabbitMintingFarmAddress, name: 'hasClaimed', params: [account] },
        ])
        const balanceOf = await pancakeRabbitsContract.methods.balanceOf(account).call()
        const [canClaim]: [boolean] = canClaimArr
        const [hasClaimed]: [boolean] = hasClaimedArr

        setState((prevState) => ({
          ...prevState,
          isInitialized: true,
          canClaim,
          hasClaimed,
          balanceOf,
        }))
      } catch (error) {
        console.error('an error occured', error)
      }
    }

    if (account) {
      fetchContractData()
    }
  }, [isInitialized, account, setState])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [isMounted])

  const canBurnNft = currentBlock <= state.endBlockNumber
  const getTokenIds = (bunnyId: number) => nftList[bunnyId]?.tokenIds

  /**
   * Allows consumers to re-fetch all data from the contract. Triggers the effects.
   * For example when a transaction has been completed
   */
  const reInitialize = () => {
    // Only attempt to re-initialize if the component is still mounted
    // Transactions can take awhile so it is likely some users will navigate to another page
    // before the transaction is finished
    if (isMounted.current) {
      setState((prevState) => ({ ...prevState, isInitialized: false }))
    }
  }

  return (
    <NftProviderContext.Provider value={{ ...state, nfts: nftList, canBurnNft, getTokenIds, reInitialize }}>
      {children}
    </NftProviderContext.Provider>
  )
}

export default NftProvider
