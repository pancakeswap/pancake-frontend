import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'

import { findBestTrade } from './graph'
import { TradeConfig } from './types'

export async function getBestTrade(
  amount: CurrencyAmount<Currency>,
  quoteCurrency: Currency,
  tradeType: TradeType,
  { candidatePools, gasPriceWei }: TradeConfig,
) {
  const bestTrade = await findBestTrade({
    tradeType,
    amount,
    quoteCurrency,
    gasPriceWei,
    candidatePools,
    streams: 1,
  })
  return bestTrade
}
