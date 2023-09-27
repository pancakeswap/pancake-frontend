import { BigintIsh, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade, SwapOptions } from '@pancakeswap/smart-router/evm'
import type { AbiParametersToPrimitiveTypes } from 'abitype'
import { Permit2Permit } from './inputTokens'
import { ABI_PARAMETER, CommandType } from './routerCommands'

export type AnyTradeType = SmartRouterTrade<TradeType> | SmartRouterTrade<TradeType>[]

export type SwapRouterConfig = {
  sender?: string // address
  deadline?: BigintIsh | undefined
}

export type PancakeSwapOptions = Omit<SwapOptions, 'inputTokenPermit'> & {
  inputTokenPermit?: Permit2Permit
}

export type ChainConfig = {
  router: string
  creationBlock: number
  weth: string
}

export type ABIType = typeof ABI_PARAMETER
export type ABIParametersType<TCommandType extends CommandType> = AbiParametersToPrimitiveTypes<ABIType[TCommandType]>
