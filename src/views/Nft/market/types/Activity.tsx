import { MarketEvent } from './MarketEvent'
import { TokenMarketData } from '../../../../state/nftMarket/types'

export interface Activity {
  marketEvent: MarketEvent
  timestamp: string
  tx: string
  nft?: TokenMarketData
  price?: string
  otherParty?: string
  buyer?: string
  seller?: string
}
