/* eslint-disable @typescript-eslint/no-unused-vars */
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'

import { Pool, Trade } from './types'

interface Options {
  maxHops?: number
  maxSplits?: number
  candidatePools?: Pool[]
}

export async function getBestTrade(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  options: Options = {},
): Promise<Trade<TradeType> | null> {
  return null
}
