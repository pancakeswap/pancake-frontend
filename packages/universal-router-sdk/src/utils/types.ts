import { ChainId, Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { FeeAmount, Tick } from '@pancakeswap/v3-sdk'
import { BigintIsh, TradeType } from '@pancakeswap/sdk'

export interface GasCost {
  gasEstimate: bigint
  // The gas cost in terms of the quote token.
  gasCostInToken: CurrencyAmount<Currency>
  gasCostInUSD: CurrencyAmount<Currency>
}

export enum RouteType {
  V2,
  V3,
  STABLE,
  MIXED,
  MM,
}

export interface BaseRoute {
  // Support all v2, v3, stable, and combined
  // Can derive from pools
  type: RouteType

  // Pools that swap will go through
  pools: Pool[]

  path: Currency[]

  input: Currency

  output: Currency
}

export interface RouteWithoutQuote extends BaseRoute {
  percent: number
  amount: CurrencyAmount<Currency>
}

export type RouteEssentials = Omit<RouteWithoutQuote, 'input' | 'output' | 'amount'>

export interface Route extends RouteEssentials {
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
}

export interface RouteQuote extends GasCost {
  // If exact in, this is (quote - gasCostInToken). If exact out, this is (quote + gasCostInToken).
  quoteAdjustedForGas: CurrencyAmount<Currency>
  quote: CurrencyAmount<Currency>
}

export type RouteWithQuote = RouteWithoutQuote & RouteQuote

export type RouteWithoutGasEstimate = Omit<
  RouteWithQuote,
  'quoteAdjustedForGas' | 'gasEstimate' | 'gasCostInToken' | 'gasCostInUSD'
>

export interface BestRoutes {
  gasEstimate: bigint
  gasEstimateInUSD: CurrencyAmount<Currency>
  routes: Route[]
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
}

export interface SmartRouterTrade<TTradeType extends TradeType> {
  tradeType: TTradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>

  // From routes we know how many splits and what percentage does each split take
  routes: Route[]

  gasEstimate: bigint
  gasEstimateInUSD: CurrencyAmount<Currency>
  blockNumber?: number
}

interface GetPoolParams {
  currencyA?: Currency
  currencyB?: Currency
  blockNumber?: BigintIsh
  protocols?: PoolType[]

  // Only use this param if we want to specify pairs we want to get
  pairs?: [Currency, Currency][]
}

export interface PoolProvider {
  getCandidatePools: (params: GetPoolParams) => Promise<Pool[]>
}

export type L1ToL2GasCosts = {
  gasUsedL1: bigint
  gasCostL1USD: CurrencyAmount<Currency>
  gasCostL1QuoteToken: CurrencyAmount<Currency>
}

export interface GasEstimateRequiredInfo {
  initializedTickCrossedList: number[]
}

export interface GasModel {
  estimateGasCost: (route: RouteWithoutGasEstimate, info: GasEstimateRequiredInfo) => GasCost
}

export interface QuoterOptions {
  blockNumber?: BigintIsh
  gasModel: GasModel
}

export interface QuoteProvider {
  getRouteWithQuotesExactIn: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>
  getRouteWithQuotesExactOut: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>
}

export type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => any

export type SubgraphProvider = ({ chainId }: { chainId?: ChainId }) => any

export interface TradeConfig {
  gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
  blockNumber?: number | (() => Promise<number>)
  poolProvider: PoolProvider
  quoteProvider: QuoteProvider
  maxHops?: number
  maxSplits?: number
  distributionPercent?: number
  allowedPoolTypes?: PoolType[]
  quoterOptimization?: boolean
}

export interface RouteConfig extends TradeConfig {
  blockNumber?: number
}

export enum PoolType {
  V2,
  V3,
  STABLE,
}

export interface BasePool {
  type: PoolType
}

export interface V2Pool extends BasePool {
  type: PoolType.V2
  reserve0: CurrencyAmount<Currency>
  reserve1: CurrencyAmount<Currency>
}

export interface StablePool extends BasePool {
  address: string
  type: PoolType.STABLE
  // Could be 2 token pool or more
  balances: CurrencyAmount<Currency>[]
  amplifier: bigint
  // Swap fee
  fee: Percent
}

export interface V3Pool extends BasePool {
  type: PoolType.V3
  token0: Currency
  token1: Currency
  // Different fee tier
  fee: FeeAmount
  liquidity: bigint
  sqrtRatioX96: bigint
  tick: number
  address: string
  token0ProtocolFee: Percent
  token1ProtocolFee: Percent

  // Allow pool with no ticks data provided
  ticks?: Tick[]
}

export type Pool = V2Pool | V3Pool | StablePool

export interface WithTvl {
  tvlUSD: bigint
}

export type V3PoolWithTvl = V3Pool & WithTvl

export type V2PoolWithTvl = V2Pool & WithTvl

export type StablePoolWithTvl = StablePool & WithTvl

export type AnyTradeType = SmartRouterTrade<TradeType> | SmartRouterTrade<TradeType>[]
