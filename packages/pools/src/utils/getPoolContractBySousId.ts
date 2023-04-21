import { ChainId } from '@pancakeswap/sdk'
import { Contract } from '@ethersproject/contracts'
import { Provider } from '@ethersproject/providers'
import type { Signer } from '@ethersproject/abstract-signer'

import { getPoolsConfig } from '../constants'
import { isLegacyPool } from './isLegacyPool'
import sousChefABI from '../abis/ISousChefV2.json'
import sousChefBnbABI from '../abis/ISousChefBNB.json'
import smartChefABI from '../abis/ISmartChef.json'
import { PoolCategory } from '../types'

interface Params {
  chainId?: ChainId
  sousId: number
  provider: Signer | Provider
}

export function getPoolContractBySousId({ chainId, sousId, provider }: Params) {
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
    const abi = pool.poolCategory === PoolCategory.BINANCE ? sousChefBnbABI : sousChefABI
    return new Contract(contractAddress, abi, provider)
  }
  return new Contract(contractAddress, smartChefABI, provider)
}
