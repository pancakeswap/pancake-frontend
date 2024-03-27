import { ChainId } from '@pancakeswap/chains'
import { TradeType } from '@pancakeswap/swap-sdk-core'
import { PoolType, V4Router, SmartRouter } from '@pancakeswap/smart-router'

type LastInUnion<U> = UnionToIntersection<U extends unknown ? (x: U) => 0 : never> extends (x: infer l) => 0 ? l : never
type UnionToIntersection<union> = (union extends unknown ? (arg: union) => 0 : never) extends (arg: infer i) => 0
  ? i
  : never

export type UnionToTuple<
  union,
  ///
  last = LastInUnion<union>,
> = [union] extends [never] ? [] : [...UnionToTuple<Exclude<union, last>>, last]

export type TradeTypeKeys = UnionToTuple<keyof typeof TradeType>

export type PoolTypeKeys = UnionToTuple<keyof typeof PoolType>

export type AMMOrder = V4Router.Transformer.SerializedV4Trade & {
  quoteGasAdjusted: SmartRouter.Transformer.SerializedCurrencyAmount
  gasUseEstimateUSD: string
}

export enum OrderType {
  DUTCH_LIMIT = 'DUTCH_LIMIT',
  PCS_CLASSIC = 'PCS_CLASSIC',
}

export type AMMRequest = {
  type: 'EXACT_INPUT' | 'EXACT_OUTPUT'
  amount: string
  tokenInChainId: ChainId
  tokenIn: string
  tokenOutChainId: ChainId
  tokenOut: string
  configs: (
    | {
        protocols: ('V2' | 'V3' | 'STABLE')[]
        routingType: OrderType.PCS_CLASSIC
        gasPriceWei?: string | undefined
        maxHops?: number | undefined
        maxSplits?: number | undefined
      }
    | {
        routingType: OrderType.DUTCH_LIMIT
        useSyntheticQuotes?: boolean | undefined
        swapper?: `0x${string}` | undefined
        exclusivityOverrideBps?: number | undefined
        startTimeBufferSecs?: number | undefined
        auctionPeriodSecs?: number | undefined
        deadlineBufferSecs?: number | undefined
      }
  )[]
  slippageTolerance?: string | undefined
}
