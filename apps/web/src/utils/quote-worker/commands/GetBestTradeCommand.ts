import { SmartRouter } from '@pancakeswap/smart-router'
import { createViemPublicClientGetter } from 'utils/viem'
import { Command } from '../types'

const { parseCurrency, parseCurrencyAmount, parsePool, serializeTrade } = SmartRouter.Transformer

export class GetBestTradeCommand implements Command {
  constructor(private params: SmartRouter.APISchema.RouterPostParams, private abortController: AbortController) {
    this.params = params
    this.abortController = abortController
  }

  async execute() {
    // Implementation of getBestTrade logic
    const parsed = SmartRouter.APISchema.zRouterPostParams.safeParse(this.params)

    if (parsed.success === false) throw new Error(parsed.error.message)

    const {
      amount,
      chainId,
      currency,
      tradeType,
      blockNumber,
      gasPriceWei,
      maxHops,
      maxSplits,
      poolTypes,
      candidatePools,
      onChainQuoterGasLimit: gasLimit,
      nativeCurrencyUsdPrice,
      quoteCurrencyUsdPrice,
    } = parsed.data
    const onChainProvider = createViemPublicClientGetter({ transportSignal: this.abortController.signal })
    const onChainQuoteProvider = SmartRouter.createQuoteProvider({ onChainProvider, gasLimit })
    const currencyAAmount = parseCurrencyAmount(chainId, amount)

    const currencyB = parseCurrency(chainId, currency)

    const pools = candidatePools.map((pool) => parsePool(chainId, pool as any))

    const gasPrice = gasPriceWei
      ? BigInt(gasPriceWei)
      : async () => BigInt((await onChainProvider({ chainId }).getGasPrice()).toString())

    const res = await SmartRouter.getBestTrade(currencyAAmount, currencyB, tradeType, {
      gasPriceWei: gasPrice,
      poolProvider: SmartRouter.createStaticPoolProvider(pools),
      quoteProvider: onChainQuoteProvider,
      maxHops,
      maxSplits,
      blockNumber: blockNumber ? Number(blockNumber) : undefined,
      allowedPoolTypes: poolTypes,
      quoterOptimization: false,
      quoteCurrencyUsdPrice,
      nativeCurrencyUsdPrice,
      signal: this.abortController.signal,
    })

    return res && serializeTrade(res)
  }
}
