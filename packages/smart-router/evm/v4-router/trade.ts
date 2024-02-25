import { findBestTrade } from './graph'
import { TradeConfig } from './types'

export async function getBestTrade({ amount, candidatePools, quoteCurrency, gasPriceWei }: TradeConfig) {
  const trade = await findBestTrade({
    amount,
    quoteCurrency,
    gasPriceWei,
    candidatePools,
    streams: 2,
  })
  return trade
}
