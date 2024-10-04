import { ChainId } from '@pancakeswap/chains'
import { Account, Address, Chain, GetContractReturnType, PublicClient, WalletClient, getContract } from 'viem'

import { smartChefABI } from '../abis/ISmartChef'
import { sousChefBnbABI } from '../abis/ISousChefBNB'
import { sousChefV2ABI } from '../abis/ISousChefV2'
import { getPoolsConfig } from '../constants'
import { PoolCategory } from '../types'
import { isLegacyPool } from './isLegacyPool'

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
      client: {
        public: publicClient as PublicClient,
        wallet: signer,
      },
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
      client: {
        public: publicClient as PublicClient,
        wallet: signer,
      },
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
      client: {
        public: publicClient as PublicClient,
        wallet: signer,
      },
    }),
    abi: smartChefABI,
    address,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export async function getPoolContractBySousId({ chainId, sousId, signer, publicClient }: Params): Promise<any | null> {
  if (!chainId) {
    return null
  }
  const pools = await getPoolsConfig(chainId)
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
