import { PermitSingle } from '@pancakeswap/permit2-sdk'
import { BigintIsh, TradeType } from '@pancakeswap/sdk'
import { BaseRoute, RouteType, SmartRouterTrade, SwapOptions } from '@pancakeswap/smart-router'
import { Address } from 'viem'

export interface Permit2Signature extends PermitSingle {
  signature: `0x${string}`
}

export type SwapRouterConfig = {
  sender?: Address // address
  deadline?: BigintIsh | undefined
}

export type FlatFeeOptions = {
  amount: BigintIsh
  recipient: Address
}

export type PancakeSwapOptions = Omit<SwapOptions, 'inputTokenPermit'> & {
  inputTokenPermit?: Permit2Signature
  flatFee?: FlatFeeOptions
}

export type SwapSection = {
  tradeType: TradeType
  route: BaseRoute
  type: RouteType.V2 | RouteType.V3 | RouteType.V4BIN | RouteType.V4CL | RouteType.STABLE
  inAmount: bigint
  outAmount: bigint
  needsWrapInput: boolean
  needsUnwrapOutput: boolean
  recipient: Address
  optionRecipient?: Address
  isLastOfRoute: boolean
  isFinal: boolean
  trade: Omit<SmartRouterTrade<TradeType>, 'gasEstimate'>
}
