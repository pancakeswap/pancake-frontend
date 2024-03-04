import { Abi, Address } from 'viem'
import { erc20ABI, useWalletClient } from 'wagmi'
import { useMemo } from 'react'

import { ChainId } from '@pancakeswap/chains'
import { useActiveChainId } from './useActiveChainId'
import { getContract } from '../utils/contractHelpers'
import { multicallABI } from '../config/abi/Multicall'
import { getMulticallAddress } from '../utils/addressHelpers'
import { WNATIVE } from '@pancakeswap/sdk'

// Code below migrated from Exchange useContract.ts

type UseContractOptions = {
  chainId?: ChainId
}

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions
) {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = options?.chainId || currentChainId
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20ABI)
}

export function useWNativeContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, wethABI)
}
