import { Address } from 'viem'

export type Tuple<T, N, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [...R, T]>

export type Bytes32 = `0x${string}`

/**
 * Hooks registration for all type pool
 * if the value is true, the hook will be registered
 */
export type HooksRegistration = {
  beforeInitialize?: boolean
  afterInitialize?: boolean
  beforeAddLiquidity?: boolean
  afterAddLiquidity?: boolean
  beforeRemoveLiquidity?: boolean
  afterRemoveLiquidity?: boolean
  beforeSwap?: boolean
  afterSwap?: boolean
  beforeDonate?: boolean
  afterDonate?: boolean
}

export type BinTree = {
  level0: Bytes32
  level1: Record<number, Bytes32>
  level2: Record<number, Bytes32>
}

export type PoolType = 'CL' | 'Bin'

export type CLPoolParameter = {
  /**
   * Hooks registration for the pool
   * @see {@link HooksRegistration}
   */
  hooksRegistration?: HooksRegistration
  tickSpacing: number
}

export type BinPoolParameter = {
  /**
   * Hooks registration for the pool
   * @see {@link HooksRegistration}
   */
  hooksRegistration?: HooksRegistration
  binStep: number
}

/**
 * PoolKey is a unique identifier for a pool
 *
 * decoded version of `PoolKey`
 *
 */
export type PoolKey<TPoolType extends PoolType = never> = {
  /**
   * the lower currency address of the pool, use zero address for native token
   */
  currency0: Address
  /**
   * the higher currency address of the pool
   */
  currency1: Address
  /**
   * the address of the hooks contract, if not set, use zero address
   */
  hooks?: Address
  /**
   * the address of the pool manager contract
   */
  poolManager: Address
  /**
   * the lp fee of the pool, the max fee for cl pool is 1_000_000(100%) and for bin, it is 100_000(10%).
   * If the pool has dynamic fee then it must be exactly equal to 0x800000
   *
   * @see DYNAMIC_FEE_FLAG
   */
  fee: number
  /**
   * the parameters of the pool
   * include:
   *   1. hooks registration callback
   *   2. pool specific parameters: tickSpacing for CLPool, binStep for BinPool
   *
   * @see BinPoolParameter
   * @see CLPoolParameter
   * @see HooksRegistration
   */
  parameters: TPoolType extends 'CL'
    ? CLPoolParameter
    : TPoolType extends 'Bin'
    ? BinPoolParameter
    : CLPoolParameter | BinPoolParameter
}

/**
 * encoded poolKey struct
 *
 * @see PoolKey
 * @see {@link https://github.com/pancakeswap/pancake-v4-core/blob/main/src/types/PoolKey.sol|v4-core}
 */
export type EncodedPoolKey = {
  currency0: Address
  currency1: Address
  hooks: Address
  poolManager: Address
  fee: number
  parameters: Bytes32
}
