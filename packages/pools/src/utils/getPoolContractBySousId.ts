import { ChainId } from '@pancakeswap/sdk'
import { WalletClient, getContract, PublicClient, Address, GetContractReturnType, Account, Chain } from 'viem'

import { getPoolsConfig } from '../constants'
import { isLegacyPool } from './isLegacyPool'
import { smartChefABI } from '../abis/ISmartChef'
import { PoolCategory } from '../types'
import { sousChefV2ABI } from '../abis/ISousChefV2'
import { sousChefBnbABI } from '../abis/ISousChefBNB'

interface Params {
  chainId?: ChainId
  sousId: number
  signer?: any
  publicClient?: any
}

type GetContractReturnType_<TAbi extends readonly unknown[]> = GetContractReturnType<TAbi, any, any> & {
  abi: TAbi
  address: Address
  account?: Account
  chain?: Chain
}

export function getSousChefBNBContract({
  address,
  signer,
  publicClient,
}: {
  address: Address
  signer?: WalletClient
  publicClient?: PublicClient
}): GetContractReturnType_<typeof sousChefBnbABI> {
  return {
    ...getContract({
      abi: sousChefBnbABI,
      address,
      walletClient: signer,
      publicClient,
    }),
    abi: sousChefBnbABI,
    address,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export function getSousChefV2Contract({
  address,
  signer,
  publicClient,
}: {
  address: Address
  signer?: WalletClient
  publicClient?: PublicClient
}): GetContractReturnType_<typeof sousChefV2ABI> {
  return {
    ...getContract({
      abi: sousChefV2ABI,
      address,
      walletClient: signer,
      publicClient,
    }),
    abi: sousChefV2ABI,
    address,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export function getSmartChefChefV2Contract({
  address,
  signer,
  publicClient,
}: {
  address: Address
  signer?: WalletClient
  publicClient?: PublicClient
}): GetContractReturnType_<typeof smartChefABI> {
  return {
    ...getContract({
      abi: smartChefABI,
      address,
      walletClient: signer,
      publicClient,
    }),
    abi: smartChefABI,
    address,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export function getPoolContractBySousId({ chainId, sousId, signer, publicClient }: Params): any | null {
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
    if (pool.poolCategory === PoolCategory.BINANCE) {
      return getSousChefBNBContract({ address: contractAddress, signer, publicClient })
    }
    return getSousChefV2Contract({ address: contractAddress, signer, publicClient })
  }
  return getSmartChefChefV2Contract({ address: contractAddress, signer, publicClient })
}
