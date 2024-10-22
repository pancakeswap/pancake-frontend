import { Address } from 'viem'

export interface PathKey {
  intermediateCurrency: Address
  fee: number
  hooks: Address
  poolManager: Address
  hookData: `0x${string}`
  parameters: `0x${string}`
}

export interface PoolKey {
  currency0: Address
  currency1: Address
  hooks: Address
  poolManager: Address
  fee: number
  parameters: `0x${string}`
}

export interface CLSwapExactInputParams {
  address: Address
  path: PathKey[]
  amountIn: bigint
  amountOutMinimum: bigint
}

export interface CLSwapExactInputSingleParams {
  poolKey: PoolKey
  zeroForOne: boolean
  amountIn: bigint
  amountOutMinimum: bigint
  sqrtPriceLimitX96: bigint
  hookData: `0x${string}`
}

export interface BinSwapExactInputSingleParams {
  poolKey: PoolKey
  swapForY: boolean
  amountIn: bigint
  amountOutMinimum: bigint
  hookData: `0x${string}`
}
