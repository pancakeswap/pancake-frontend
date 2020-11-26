export type IfoStatus = 'coming_soon' | 'live' | 'finished'

export type Ifo = {
  id: string
  isActive: boolean
  address: string
  name: string
  subTitle?: string
  description?: string
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  projectSiteUrl: string
  currency: string
  currencyAddress: string
}

export enum QuoteToken {
  'BNB' = 'BNB',
  'CAKE' = 'CAKE',
  'SYRUP' = 'SYRUP',
}

export type Pool = {
  sousId: number
  tokenName: string
  stakingTokenName: QuoteToken
  stakingTokenAddress: string
  contractAddress: {
    97?: string
    56: string
  }
  projectLink: string
  tokenPerBlock: string
  sortOrder?: number
  harvest?: boolean
  isCommunity?: boolean
  isFinished?: boolean
}
