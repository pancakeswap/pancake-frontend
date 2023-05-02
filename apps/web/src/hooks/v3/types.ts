import { Field } from 'state/mint/actions'

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export interface LiquidityFormState {
  independentField: Field
  typedValue: string
  leftRangeTypedValue: string | true
  rightRangeTypedValue: string | true
  startPriceTypedValue: string
}

// Tick with fields parsed to bigints, and active liquidity computed.
export interface TickProcessed {
  tick: number
  liquidityActive: bigint
  liquidityNet: bigint
  price0: string
}
