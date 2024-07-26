import { SmartRouter, V4Router } from '@pancakeswap/smart-router'
import { createViemPublicClientGetter } from 'utils/viem'
import { Command } from '../types'

const { parseCurrency, parseCurrencyAmount, parsePool } = SmartRouter.Transformer

export class GetBestTradeOffchainCommand implements Command {
  constructor(
    private params: V4Router.APISchema.RouterPostParams,
    private id: number,
    private abortController: AbortController,
  ) {
    this.id = id
    this.params = params
    this.abortController = abortController
  }

  async execute() {
    // Implementation of getBestTradeOffchain logic
    const parsed = V4Router.APISchema.zRouterPostParams.safeParse(this.params)

    if (parsed.success === false) throw new Error(parsed.error.message)

    const { amount, chainId, currency, tradeType, gasPriceWei, maxHops, candidatePools, maxSplits } = parsed.data
    const onChainProvider = createViemPublicClientGetter({ transportSignal: this.abortController.signal })
    const currencyAAmount = parseCurrencyAmount(chainId, amount)
    const currencyB = parseCurrency(chainId, currency)
    // FIXME: typing issue
    const pools = candidatePools.map((pool) => parsePool(chainId, pool as any))

    const gasPrice = gasPriceWei
      ? BigInt(gasPriceWei)
      : async () => BigInt((await onChainProvider({ chainId }).getGasPrice()).toString())

    const res = await V4Router.getBestTrade(currencyAAmount, currencyB, tradeType, {
      gasPriceWei: gasPrice,
      maxHops,
      maxSplits,
      candidatePools: pools,
      signal: this.abortController.signal,
    })

    return res && V4Router.Transformer.serializeTrade(res)
  }
}
