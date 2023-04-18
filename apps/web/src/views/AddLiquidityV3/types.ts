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

export const QUICK_ACTION_CONFIGS: Record<FeeAmount, { percentage: number; balanceFactor: number }[]> = {
  [FeeAmount.LOWEST]: [
    { percentage: 10, balanceFactor: 1.11 },
    { percentage: 20, balanceFactor: 1.25 },
    { percentage: 50, balanceFactor: 2 },
  ],
  [FeeAmount.LOW]: [
    { percentage: 5, balanceFactor: 1.08 },
    { percentage: 10, balanceFactor: 1.11 },
    { percentage: 20, balanceFactor: 1.25 },
  ],
  [FeeAmount.MEDIUM]: [
    { percentage: 10, balanceFactor: 1.11 },
    { percentage: 20, balanceFactor: 1.25 },
    { percentage: 50, balanceFactor: 2 },
  ],
  [FeeAmount.HIGH]: [
    { percentage: 10, balanceFactor: 1.11 },
    { percentage: 20, balanceFactor: 1.25 },
    { percentage: 50, balanceFactor: 2 },
  ],
}

export type HandleFeePoolSelectFn = (arg: HandleFeePoolSelectArgs) => void
