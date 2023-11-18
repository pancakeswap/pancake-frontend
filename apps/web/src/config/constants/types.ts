import type { FarmConfigBaseProps, SerializedFarmConfig } from '@pancakeswap/farms'
import { Currency, CurrencyAmount, Percent, Price, Token, Trade, TradeType } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { LegacyTradeWithStableSwap as TradeWithStableSwap } from '@pancakeswap/smart-router/legacy-router'
import BigNumber from 'bignumber.js'
import { Address } from 'wagmi'
import { FeeAmount } from '@pancakeswap/v3-sdk'
// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>

export type TranslatableText =
  | string
  | {
      key: string
      data?: {
        [key: string]: string | number
      }
    }
export interface Addresses {
  56: Address
  [chainId: number]: Address
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
  'AUTO' = 'Auto',
}

export type { SerializedFarmConfig, FarmConfigBaseProps }

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users: number
  points: number
  images: TeamImages
  background: string
  textColor: string
}

export type CampaignType = 'ifo' | 'teambattle' | 'participation'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export enum LotteryStatus {
  PENDING = 'pending',
  OPEN = 'open',
  CLOSE = 'close',
  CLAIMABLE = 'claimable',
}

export interface LotteryTicket {
  id: string
  number: string
  status: boolean
  rewardBracket?: number
  roundId?: string
  cakeReward?: string
}

export interface LotteryTicketClaimData {
  ticketsWithUnclaimedRewards: LotteryTicket[]
  allWinningTickets: LotteryTicket[]
  cakeTotal: BigNumber
  roundId: string
}

// Farm Auction
export interface FarmAuctionBidderConfig {
  account: string
  farmName: string
  tokenAddress: string
  quoteToken: Token
  tokenName: string
  projectSite?: string
  lpAddress?: string
}

// Note: this status is slightly different compared to 'status' config
// from Farm Auction smart contract
export enum AuctionStatus {
  ToBeAnnounced, // No specific dates/blocks to display
  Pending, // Auction is scheduled but not live yet (i.e. waiting for startBlock)
  Open, // Auction is open for bids
  Finished, // Auction end block is reached, bidding is not possible
  Closed, // Auction was closed in smart contract
}

export interface Auction {
  id: number
  status: AuctionStatus
  startBlock: number
  startDate: Date
  endBlock: number
  endDate: Date
  auctionDuration: number
  initialBidAmount: number
  topLeaderboard: number
  leaderboardThreshold: BigNumber
}

export interface BidderAuction {
  id: number
  amount: BigNumber
  claimed: boolean
}

export interface Bidder extends FarmAuctionBidderConfig {
  position?: number
  isTopPosition: boolean
  samePositionAsAbove: boolean
  amount: BigNumber
}

export interface ConnectedBidder {
  account: string
  isWhitelisted: boolean
  bidderData?: Bidder
}

export const FetchStatus = {
  Idle: 'idle',
  Fetching: 'loading',
  Fetched: 'success',
  Failed: 'error',
} as const

export type TFetchStatus = (typeof FetchStatus)[keyof typeof FetchStatus]

export const isStableSwap = (trade: ITrade): trade is StableTrade => {
  return (
    Boolean((trade as StableTrade)?.maximumAmountIn) &&
    !(trade as Trade<Currency, Currency, TradeType> | TradeWithStableSwap<Currency, Currency, TradeType>)?.route
  )
}

export type ITrade =
  | Trade<Currency, Currency, TradeType>
  | StableTrade
  | TradeWithStableSwap<Currency, Currency, TradeType>
  | undefined

export type V2TradeAndStableSwap = Trade<Currency, Currency, TradeType> | StableTrade | undefined

export interface StableTrade {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  executionPrice: Price<Currency, Currency>
  priceImpact: null
  maximumAmountIn: (slippaged: Percent) => CurrencyAmount<Currency>
  minimumAmountOut: (slippaged: Percent) => CurrencyAmount<Currency>
}

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

export enum GaugeType {
  V2 = 0,
  V3 = 1,
  ALM = 2,
  VeCakePool = 3,
  Aptos = 4,
}

export const GAUGE_TYPE_NAMES = {
  [GaugeType.V2]: 'V2',
  [GaugeType.V3]: 'V3',
  [GaugeType.ALM]: 'ALM',
  [GaugeType.VeCakePool]: 'VeCakePool',
  [GaugeType.Aptos]: 'Aptos',
}

export interface GaugeBaseConfig {
  gid: number
  chainId: ChainId
  type: GaugeType
  address: Address
}

export interface GaugeV2Config extends GaugeBaseConfig {
  token0Address: Address
  token1Address: Address
  type: GaugeType.V2
  pairName: string
}
export interface GaugeV3Config extends GaugeBaseConfig {
  token0Address: Address
  token1Address: Address
  type: GaugeType.V3
  feeTier: FeeAmount
  pairName: string
}

export interface GaugeALMConfig extends GaugeBaseConfig {
  type: GaugeType.ALM
  token0Address: Address
  token1Address: Address
  pairName: string
}

export interface GaugeVeCakePoolConfig extends GaugeBaseConfig {
  type: GaugeType.VeCakePool
  pairName: string
}

export type GaugeConfig = GaugeV2Config | GaugeV3Config | GaugeALMConfig | GaugeVeCakePoolConfig
