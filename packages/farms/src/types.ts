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
  isStable?: boolean
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

export interface SerializedFarmConfig extends FarmConfigBaseProps {
  token: SerializedWrappedToken
  quoteToken: SerializedWrappedToken
}

export interface SerializedFarmPublicData extends SerializedFarmConfig {
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
