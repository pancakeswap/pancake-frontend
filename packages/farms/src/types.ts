import { SerializedToken, Token } from '@pancakeswap/swap-sdk-core'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { SerializedWrappedToken } from '@pancakeswap/token-lists'
import BigNumber from 'bignumber.js'
import { BigNumber as EtherBigNumber } from '@ethersproject/bignumber'

export type FarmsDynamicDataResult = {
  tokenAmountTotal: string
  quoteTokenAmountTotal: string
  lpTotalSupply: string
  lpTotalInQuoteToken: string
  tokenPriceVsQuote: string
  poolWeight: string
  multiplier: string
}

export type FarmsDynamicDataResultV2 = {
  lmPool: string
  lmPoolLiquidity: string
  tokenPriceVsQuote: string
  poolWeight: string
  multiplier: string
}

export type FarmPriceV3 = {
  tokenPriceBusd: string
  quoteTokenPriceBusd: string
}

export type FarmTVL = {
  activeTvlUSD?: string
  activeTvlUSDUpdatedAt?: string
  cakeApr?: string
}

export type FarmData = SerializedFarmConfig & FarmsDynamicDataResult

export type FarmV3Data = FarmConfigV3 & FarmsDynamicDataResultV2

export type FarmV3DataWithPrice = FarmV3Data & FarmPriceV3 & FarmConfigV3

export type FarmV3DataWithPriceTVL = FarmV3DataWithPrice & FarmTVL
export type SerializedFarmV3DataWithPrice = FarmV3Data & FarmPriceV3 & SerializedFarmConfigV3

export interface FarmConfigBaseProps {
  pid: number
  v1pid?: number
  vaultPid?: number
  lpSymbol: string
  lpAddress: string
  multiplier?: string
  isCommunity?: boolean
  auctionHostingStartSeconds?: number
  auctionHostingEndDate?: string
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
  boosted?: boolean
}

export interface SerializedStableFarmConfig extends FarmConfigBaseProps {
  token: SerializedWrappedToken
  quoteToken: SerializedWrappedToken
  stableSwapAddress: string
  infoStableSwapAddress: string
  stableLpFee?: number
}

export interface SerializedClassicFarmConfig extends FarmConfigBaseProps {
  token: SerializedWrappedToken
  quoteToken: SerializedWrappedToken
}

export type FarmConfigV3 = {
  pid: number
  lpSymbol: string
  lpAddress: string
  boosted?: boolean

  token: Token
  quoteToken: Token
  feeAmount: FeeAmount
}

export type SerializedFarmConfigV3 = FarmConfigV3 & {
  token: SerializedToken
  quoteToken: SerializedToken
}

export type SerializedFarmConfig = SerializedStableFarmConfig | SerializedClassicFarmConfig

export interface SerializedFarmPublicData extends SerializedClassicFarmConfig {
  lpTokenPrice?: string
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: string
  quoteTokenAmountTotal?: string
  lpTotalInQuoteToken?: string
  lpTotalSupply?: string
  tokenPriceVsQuote?: string
  poolWeight?: string
  boosted?: boolean
  infoStableSwapAddress?: string
  stableSwapAddress?: string
  stableLpFee?: number
  stableLpFeeRateOfTotalFee?: number
  lpTokenStakedAmount?: string
}

export interface AprMap {
  [key: string]: number
}

export function isStableFarm(farmConfig: SerializedFarmConfig): farmConfig is SerializedStableFarmConfig {
  return 'stableSwapAddress' in farmConfig && typeof farmConfig.stableSwapAddress === 'string'
}

export interface SerializedFarmUserData {
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
  proxy?: {
    allowance: string
    tokenBalance: string
    stakedBalance: string
    earnings: string
  }
}

export interface SerializedFarm extends SerializedFarmPublicData {
  userData?: SerializedFarmUserData
}

export interface SerializedFarmsV3State {
  data: SerializedFarmPublicData[]
  chainId?: number
  userDataLoaded: boolean
  loadingKeys: Record<string, boolean>
  poolLength?: number
}

export interface SerializedFarmsState {
  data: SerializedFarm[]
  chainId?: number
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
  loadingKeys: Record<string, boolean>
  poolLength?: number
  regularCakePerBlock?: number
}

export interface DeserializedFarmConfig extends FarmConfigBaseProps {
  token: Token
  quoteToken: Token
}

export interface DeserializedFarmUserData {
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnings: BigNumber
  proxy?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
  }
}

export interface DeserializedFarm extends DeserializedFarmConfig {
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: BigNumber
  quoteTokenAmountTotal?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  lpTotalSupply?: BigNumber
  lpTokenPrice?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  userData?: DeserializedFarmUserData
  boosted?: boolean
  isStable?: boolean
  stableSwapAddress?: string
  stableLpFee?: number
  stableLpFeeRateOfTotalFee?: number
  lpTokenStakedAmount?: BigNumber
}

export interface DeserializedFarmsState {
  data: DeserializedFarm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
  poolLength?: number
  regularCakePerBlock?: number
}

export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
}

// V3
export interface SerializedFarmsV3Response {
  poolLength: number
  farmsWithPrice: SerializedFarmV3DataWithPrice[]
  cakePerSecond: string
}

export interface FarmsV3Response<T extends FarmV3DataWithPrice = FarmV3DataWithPrice> {
  poolLength: number
  farmsWithPrice: T[]
  cakePerSecond: string
}

export type IPendingCakeByTokenId = Record<string, EtherBigNumber>

export interface PositionDetails {
  nonce: EtherBigNumber
  tokenId: EtherBigNumber
  operator: string
  token0: string
  token1: string
  fee: number
  tickLower: number
  tickUpper: number
  liquidity: EtherBigNumber
  feeGrowthInside0LastX128: EtherBigNumber
  feeGrowthInside1LastX128: EtherBigNumber
  tokensOwed0: EtherBigNumber
  tokensOwed1: EtherBigNumber
  isStaked?: boolean
}

export interface FarmV3DataWithPriceAndUserInfo extends FarmV3DataWithPriceTVL {
  unstakedPositions: PositionDetails[]
  stakedPositions: PositionDetails[]
  pendingCakeByTokenIds: IPendingCakeByTokenId
}
