import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useBlock from 'hooks/useBlock'
import rabbitmintingfarm from 'config/abi/rabbitmintingfarm.json'
import { RABBIT_MINTING_FARM_ADDRESS } from 'config/constants/nfts'
import multicall from 'utils/multicall'
import { getPancakeRabbitContract } from '../utils/contracts'

interface NftProviderProps {
  children: ReactNode
}

type BunnyMap = {
  [key: number]: number[]
}

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
  bunnyMap: BunnyMap
}

type Context = {
  canBurnNft: boolean
  getTokenIds: (bunnyId: number) => number[]
  reInitialize: () => void
} & State

export const NftProviderContext = createContext<Context | null>(null)

const NftProvider: React.FC<NftProviderProps> = ({ children }) => {
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
    bunnyMap: {},
  })
  const { account } = useWallet()
  const currentBlock = useBlock()

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
          { address: RABBIT_MINTING_FARM_ADDRESS, name: 'startBlockNumber' },
          { address: RABBIT_MINTING_FARM_ADDRESS, name: 'endBlockNumber' },
          { address: RABBIT_MINTING_FARM_ADDRESS, name: 'countBunniesBurnt' },
          { address: RABBIT_MINTING_FARM_ADDRESS, name: 'totalSupplyDistributed' },
          { address: RABBIT_MINTING_FARM_ADDRESS, name: 'currentDistributedSupply' },
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
          { address: RABBIT_MINTING_FARM_ADDRESS, name: 'canClaim', params: [account] },
          { address: RABBIT_MINTING_FARM_ADDRESS, name: 'hasClaimed', params: [account] },
        ])
        const balanceOf = await pancakeRabbitsContract.methods.balanceOf(account).call()
        const [canClaim]: [boolean] = canClaimArr
        const [hasClaimed]: [boolean] = hasClaimedArr

        let bunnyMap: BunnyMap = {}

        // If the "balanceOf" is greater than 0 then retrieve the tokenIds
        // owned by the wallet, then the bunnyId's associated with the tokenIds
        if (balanceOf > 0) {
          const getTokenIdAndBunnyId = async (index: number) => {
            try {
              const tokenId = await pancakeRabbitsContract.methods.tokenOfOwnerByIndex(account, index).call()
              const bunnyId = await pancakeRabbitsContract.methods.getBunnyId(tokenId).call()

              return [parseInt(bunnyId, 10), parseInt(tokenId, 10)]
            } catch (error) {
              return null
            }
          }

          const tokenIdPromises = []

          for (let i = 0; i < balanceOf; i++) {
            tokenIdPromises.push(getTokenIdAndBunnyId(i))
          }

          const tokenIdsOwnedByWallet = await Promise.all(tokenIdPromises)

          // While improbable a wallet can own more than one of the same bunny so the format is:
          // { [bunnyId]: [array of tokenIds] }
          bunnyMap = tokenIdsOwnedByWallet.reduce((accum, association) => {
            if (!association) {
              return accum
            }

            const [bunnyId, tokenId] = association

            return {
              ...accum,
              [bunnyId]: accum[bunnyId] ? [...accum[bunnyId], tokenId] : [tokenId],
            }
          }, {})
        }

        setState((prevState) => ({
          ...prevState,
          isInitialized: true,
          canClaim,
          hasClaimed,
          balanceOf,
          bunnyMap,
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
  const getTokenIds = (bunnyId: number) => state.bunnyMap[bunnyId]

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
    <NftProviderContext.Provider value={{ ...state, canBurnNft, getTokenIds, reInitialize }}>
      {children}
    </NftProviderContext.Provider>
  )
}

export default NftProvider
