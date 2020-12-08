import useBlock from 'hooks/useBlock'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { PANCAKE_RABBITS_ADDRESS } from 'sushi/lib/constants/nfts'
import { usePancakeRabbits } from 'hooks/rework/useContract'
import { getRabbitMintingContract } from '../utils/contracts'

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
  totalSupplyDistributed: number
  currentDistributedSupply: number
  balanceOf: number
  bunnyMap: BunnyMap
}

type Context = {
  canBurnNft: boolean
  getTokenIds: (bunnyId: number) => number[]
} & State

export const NftProviderContext = createContext<Context | null>(null)

const NftProvider: React.FC<NftProviderProps> = ({ children }) => {
  const [state, setState] = useState<State>({
    isInitialized: false,
    canClaim: false,
    hasClaimed: false,
    countBunniesBurnt: 0,
    endBlockNumber: 0,
    totalSupplyDistributed: 0,
    currentDistributedSupply: 0,
    balanceOf: 0,
    bunnyMap: {},
  })
  const { account } = useWallet()
  const currentBlock = useBlock()
  const pancakeRabbitsContract = usePancakeRabbits(PANCAKE_RABBITS_ADDRESS)

  // Static data
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const { methods } = getRabbitMintingContract()
        const promises = [
          methods.endBlockNumber().call(),
          methods.countBunniesBurnt().call(),
          methods.totalSupplyDistributed().call(),
          methods.currentDistributedSupply().call(),
        ]

        const [endBlockNumber, countBunniesBurnt, totalSupplyDistributed, currentDistributedSupply] = await Promise.all(
          promises,
        )

        setState((prevState) => ({
          ...prevState,
          isInitialized: true,
          countBunniesBurnt: parseInt(countBunniesBurnt, 10),
          endBlockNumber: parseInt(endBlockNumber, 10),
          currentDistributedSupply: parseInt(currentDistributedSupply, 10),
          totalSupplyDistributed: parseInt(totalSupplyDistributed, 10),
        }))
      } catch (error) {
        console.error('an error occured', error)
      }
    }

    fetchContractData()
  }, [setState])

  // Data from the contract that needs an account
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const { methods } = getRabbitMintingContract()
        const promises = [
          methods.canClaim(account).call(),
          methods.hasClaimed(account).call(),
          pancakeRabbitsContract.methods.balanceOf(account).call(),
        ]
        const [canClaim, hasClaimed, balanceOf] = await Promise.all(promises)
        let bunnyMap: BunnyMap = {}

        // If the "balanceOf" is greater than 0 then retrieve the tokenIds
        // owned by the wallet
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

            if (!accum[bunnyId]) {
              return { [bunnyId]: [tokenId] }
            }

            return {
              ...accum,
              [bunnyId]: [...accum[bunnyId], tokenId],
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
  }, [account, pancakeRabbitsContract, setState])

  const canBurnNft = state.endBlockNumber <= currentBlock
  const getTokenIds = (bunnyId: number) => state.bunnyMap[bunnyId]

  return (
    <NftProviderContext.Provider value={{ ...state, canBurnNft, getTokenIds }}>{children}</NftProviderContext.Provider>
  )
}

export default NftProvider
