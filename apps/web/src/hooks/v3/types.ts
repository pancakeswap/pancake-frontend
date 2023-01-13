import { BigNumber } from '@ethersproject/bignumber'
import { Field } from 'state/mint/actions'

export interface PositionDetails {
  nonce: BigNumber
  tokenId: BigNumber
  operator: string
  token0: string
  token1: string
  fee: number
  tickLower: number
  tickUpper: number
  liquidity: BigNumber
  feeGrowthInside0LastX128: BigNumber
  feeGrowthInside1LastX128: BigNumber
  tokensOwed0: BigNumber
  tokensOwed1: BigNumber
}

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
