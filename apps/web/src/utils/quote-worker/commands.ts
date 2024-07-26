import { SmartRouter, V4Router } from '@pancakeswap/smart-router'
import { Call } from 'state/multicall/actions'
import { fetchChunk } from 'state/multicall/fetchChunk'
import { createViemPublicClientGetter } from 'utils/viem'
import { Command } from './types'

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

export class MulticallChunkCommand implements Command {
  constructor(
    private params: {
      chainId: number
      chunk: Call[]
      minBlockNumber: number
    },
    private id: number,
  ) {
    this.id = id
    this.params = params
  }

  async execute() {
    return fetchChunk(this.params.chainId, this.params.chunk, this.params.minBlockNumber)
  }
}

export class AbortCommand implements Command {
  constructor(private params: number, private id: number) {
    this.id = id
    this.params = params
  }

  async execute(messageAbortControllers: Map<number, AbortController>) {
    // Implementation of abort logic
    const ac = messageAbortControllers.get(this.params)

    if (!ac) {
      throw new Error(`Abort controller not found for event id: ${this.id}`)
    }

    ac?.abort()

    return true
  }
}
