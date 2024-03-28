import { Token } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'
import { Address, Hash } from 'viem'
import { DEPLOYER_ADDRESSES, FeeAmount } from '../constants'
import { computePoolAddress } from '../utils'

export type V3PoolOverride = {
  initCodeHash?: Hash
  deployerAddress?: Address
}

/**
 * returns the address of v3 pool
 */
export const getPoolAddress = (tokenA: Token, tokenB: Token, fee: FeeAmount, override?: V3PoolOverride): Address => {
  invariant(tokenA.chainId === tokenB.chainId, 'CHAIN_IDS')
  return computePoolAddress({
    tokenA,
    tokenB,
    fee,
    initCodeHashManualOverride: override?.initCodeHash,
    deployerAddress: override?.deployerAddress ?? DEPLOYER_ADDRESSES[tokenA.chainId as keyof typeof DEPLOYER_ADDRESSES],
  })
}

/**
 * returns the address of v3 pool
 *
 * alias to same function in V4
 */
export const toId = getPoolAddress
