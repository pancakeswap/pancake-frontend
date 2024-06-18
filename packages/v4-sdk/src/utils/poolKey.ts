import { Address, zeroAddress } from 'viem'
import { Bytes32 } from '../types'
import { BinPoolParameter, CLPoolParameter, encodePoolParameters } from './encodePoolParameters'

export type PoolType = 'CL' | 'Bin'

/**
 * PoolKey is a unique identifier for a pool
 * @todo move to type
 * @see PoolKey
 */
export type PoolKey<T extends PoolType = never> = {
  currency0: Address
  currency1: Address
  hooks?: Address
  poolManager: Address
  fee: number
  parameters: T extends 'CL' ? CLPoolParameter : T extends 'Bin' ? BinPoolParameter : CLPoolParameter | BinPoolParameter
}

export type PoolKeyStruct = {
  currency0: Address
  currency1: Address
  hooks: Address
  poolManager: Address
  fee: number
  parameters: Bytes32
}

export const parsePoolKey = (poolKey: PoolKey): PoolKeyStruct => {
  return {
    ...poolKey,
    hooks: poolKey.hooks ?? zeroAddress,
    parameters: encodePoolParameters(poolKey.parameters),
  }
}
