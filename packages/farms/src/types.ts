import { SerializedWrappedToken } from '@pancakeswap/tokens'

export type FarmsDynamicDataResult = {
  tokenAmountTotal: string
  quoteTokenAmountTotal: string
  lpTotalSupply: string
  lpTotalInQuoteToken: string
  tokenPriceVsQuote: string
  poolWeight: string
  multiplier: string
}
export type FarmData = SerializedFarmConfig & FarmsDynamicDataResult

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

export interface SerializedClassicFarmConfig extends FarmConfigBaseProps {
  token: SerializedWrappedToken
  quoteToken: SerializedWrappedToken
}
export type SerializedFarmConfig = SerializedClassicFarmConfig | SerializedStableFarmConfig

export interface SerializedStableFarmConfig extends SerializedClassicFarmConfig {
  stableSwapContract: string
}

export interface SerializedFarmPublicData extends SerializedClassicFarmConfig {
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: string
  quoteTokenAmountTotal?: string
  lpTotalInQuoteToken?: string
  lpTotalSupply?: string
  tokenPriceVsQuote?: string
  poolWeight?: string
  boosted?: boolean
}

export interface AprMap {
  [key: string]: number
}

export function isStableFarm(farmConfig: SerializedFarmConfig): farmConfig is SerializedStableFarmConfig {
  return 'stableSwapContract' in farmConfig && typeof farmConfig.stableSwapContract === 'string'
}
