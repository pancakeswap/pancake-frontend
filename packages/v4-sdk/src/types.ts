export type Tuple<T, N, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [...R, T]>

export type Bytes32 = `0x${string}`

/**
 * Hooks registration for all type pool
 *
 * @see HooksRegistration
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
