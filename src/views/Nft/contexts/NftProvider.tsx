import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { getPancakeRabbitContract, getRabbitMintingContract } from '../utils/contracts'

interface NftProviderProps {
  children: ReactNode
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
}

export const RabbitMintingContext = createContext<State | null>(null)

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
  })
  const { account } = useWallet()

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
        const pancakeRabbitsContract = getPancakeRabbitContract()
        const promises = [
          methods.canClaim(account).call(),
          methods.hasClaimed(account).call(),
          pancakeRabbitsContract.methods.balanceOf(account),
        ]
        const [canClaim, hasClaimed, balanceOf] = await Promise.all(promises)

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
  }, [account, setState])

  return <RabbitMintingContext.Provider value={state}>{children}</RabbitMintingContext.Provider>
}

export default NftProvider
