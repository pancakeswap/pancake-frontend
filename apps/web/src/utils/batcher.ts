import { CurrencyParams, CurrencyUsdResult, getCurrencyKey, getCurrencyListUsdPrice } from '@pancakeswap/price-api-sdk'
import { create, windowedFiniteBatchScheduler } from '@yornaath/batshit'

export const usdPriceBatcher = create<CurrencyUsdResult, CurrencyParams, number>({
  // The fetcher resolves the list of queries to one single api call.
  fetcher: async (params: CurrencyParams[]) => {
    return getCurrencyListUsdPrice(params)
  },
  // when we call usdPriceBatcher.fetch, this will resolve the correct currency from the result.
  resolver(items, query) {
    const key = getCurrencyKey(query)
    if (!key) return 0
    return items[key] ?? 0
  },
  // this will batch all calls to users.fetch that are made within 60 milliseconds.
  scheduler: windowedFiniteBatchScheduler({
    windowMs: 60,
    maxBatchSize: 100,
  }),
})
