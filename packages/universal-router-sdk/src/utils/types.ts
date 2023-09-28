import { BigintIsh, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade, SwapOptions } from '@pancakeswap/smart-router/evm'
import { Address } from 'viem'
import type { AbiParametersToPrimitiveTypes } from 'abitype'
import { Permit2Permit } from './inputTokens'
import { ABI_PARAMETER, CommandUsed } from './routerCommands'

export type AnyTradeType = SmartRouterTrade<TradeType> | SmartRouterTrade<TradeType>[]

export type SwapRouterConfig = {
  sender?: Address // address
  deadline?: BigintIsh | undefined
}

export type PancakeSwapOptions = Omit<SwapOptions, 'inputTokenPermit'> & {
  inputTokenPermit?: Permit2Permit
}

export type ChainConfig = {
  router: Address
  creationBlock: number
  weth: Address
}

export type ABIType = typeof ABI_PARAMETER
export type ABIParametersType<TCommandType extends CommandUsed> = AbiParametersToPrimitiveTypes<ABIType[TCommandType]>
