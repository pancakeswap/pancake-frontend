import { FeeAmount } from '@pancakeswap/v3-sdk'

export enum SELECTOR_TYPE {
  V3,
  STABLE,
  V2,
}

interface HandleFeePoolSelectArgs {
  type: SELECTOR_TYPE
  feeAmount?: FeeAmount
}

export type HandleFeePoolSelectFn = (arg: HandleFeePoolSelectArgs) => void
