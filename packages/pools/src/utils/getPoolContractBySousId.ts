import { ChainId } from '@pancakeswap/sdk'
import { WalletClient, getContract, PublicClient } from 'viem'

import { getPoolsConfig } from '../constants'
import { isLegacyPool } from './isLegacyPool'
import { smartChefABI } from '../abis/ISmartChef'
import { PoolCategory } from '../types'
import { sousChefV2ABI } from '../abis/ISousChefV2'
import { sousChefBnbABI } from '../abis/ISousChefBNB'

interface Params {
  chainId?: ChainId
  sousId: number
  signer?: WalletClient
  publicClient?: PublicClient
}

export function getPoolContractBySousId({ chainId, sousId, signer, publicClient }: Params) {
  if (!chainId) {
    return null
  }
  const pools = getPoolsConfig(chainId)
  const pool = pools?.find((p) => p.sousId === Number(sousId))
  if (!pool) {
    return null
  }
  const { contractAddress } = pool
  if (isLegacyPool(pool)) {
    const abi = pool.poolCategory === PoolCategory.BINANCE ? sousChefBnbABI : sousChefV2ABI
    return {
      ...getContract({
        // @ts-ignore
        abi,
        address: contractAddress,
        walletClient: signer,
        publicClient,
      }),
      address: contractAddress,
      abi,
    }
  }
  return {
    ...getContract({ abi: smartChefABI, address: contractAddress, walletClient: signer, publicClient }),
    address: contractAddress,
    abi: smartChefABI,
  }
}
