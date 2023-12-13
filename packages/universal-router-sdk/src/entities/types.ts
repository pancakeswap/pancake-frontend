import { PermitSingle } from '@pancakeswap/permit2-sdk'
import { BigintIsh, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade, SwapOptions } from '@pancakeswap/smart-router/evm'
import { Address } from 'viem'

export interface Permit2Signature extends PermitSingle {
  signature: `0x${string}`
}

export type AnyTradeType = SmartRouterTrade<TradeType> | SmartRouterTrade<TradeType>[]

export type SwapRouterConfig = {
  sender?: Address // address
  deadline?: BigintIsh | undefined
}

export type PancakeSwapOptions = Omit<SwapOptions, 'inputTokenPermit'> & {
  inputTokenPermit?: Permit2Signature
}
