import { ChainId } from '@pancakeswap/sdk'
import { WalletClient, getContract, PublicClient, FallbackTransport, Chain } from 'viem'

import { getPoolsConfig } from '../constants'
import { isLegacyPool } from './isLegacyPool'
// import sousChefABI from '../abis/ISousChefV2.json'
// import sousChefBnbABI from '../abis/ISousChefBNB.json'
// import smartChefABI from '../abis/ISmartChef.json'
import { smartChefABI } from '../abis/ISmartChef'
import { PoolCategory } from '../types'
import { sousChefV2ABI } from '../abis/ISousChefV2'
import { sousChefBnbABI } from '../abis/ISousChefBNB'

interface Params {
  chainId?: ChainId
  sousId: number
  signer?: WalletClient
  publicClient?: PublicClient<FallbackTransport, Chain>
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
      ...getContract({ abi, address: contractAddress, walletClient: signer, publicClient }),
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
