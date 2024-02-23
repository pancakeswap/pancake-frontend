import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'

import { BaseTradeConfig, Pool, SmartRouterTrade } from '../../v3-router/types'

export type TradeConfig = Omit<BaseTradeConfig, 'poolProvider'> & {
  amount: CurrencyAmount<Currency>
  candidatePools: Pool[]
}

export type V4Trade<TTradeType extends TradeType> = Omit<SmartRouterTrade<TTradeType>, 'gasEstimateInUSD'>
