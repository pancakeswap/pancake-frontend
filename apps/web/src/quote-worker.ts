import 'utils/workerPolyfill'

import { findBestTrade } from '@pancakeswap/routing-sdk'
import { SmartRouter, V4Router } from '@pancakeswap/smart-router'
import { Call } from 'state/multicall/actions'
import { fetchChunk } from 'state/multicall/fetchChunk'
import { getLogger } from 'utils/datadog'
import { createViemPublicClientGetter } from 'utils/viem'
import { toRoutingSDKPool, toSerializableV4Trade } from 'utils/convertTrade'

const { parseCurrency, parseCurrencyAmount, parsePool, serializeTrade } = SmartRouter.Transformer

export type WorkerGetBestTradeEvent = [
  id: number,
  message: {
    cmd: 'getBestTrade'
    params: SmartRouter.APISchema.RouterPostParams
  },
]

const fetch_ = fetch
const logger = getLogger('quote-rpc', { forwardErrorsToLogs: false })

const fetchWithLogging = async (url: RequestInfo | URL, init?: RequestInit) => {
  const start = Date.now()
  let urlString: string | undefined
  let size: number | undefined
  if (init && init.method === 'POST' && init.body) {
    urlString = url.toString()
    size = init.body.toString().length / 1024
  }

  const response = await fetch_(url, init)
  const end = Date.now()
  if (urlString && size) {
    if (!urlString.includes('datadoghq.com')) {
      try {
        logger.info('Quote RPC', {
          rpc: {
            duration: end - start,
            url: urlString,
            size,
            status: response.status,
          },
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  return response
}

globalThis.fetch = fetchWithLogging

export type AbortEvent = [
  id: number,
  message: {
    cmd: 'abort'
    params: number
  },
]

export type WorkerMultiChunkEvent = [
  id: number,
  message: {
    cmd: 'multicallChunk'
    params: {
      chainId: number
      chunk: Call[]
      minBlockNumber: number
    }
  },
]

export type WorkerGetBestTradeOffchainEvent = [
  id: number,
  message: {
    cmd: 'getBestTradeOffchain'
    params: V4Router.APISchema.RouterPostParams
  },
]

export type WorkerEvent = WorkerGetBestTradeEvent | WorkerMultiChunkEvent | AbortEvent | WorkerGetBestTradeOffchainEvent

// Manage the abort actions for each message
const messageAbortControllers = new Map<number, AbortController>()

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<WorkerEvent>) => {
  const { data } = event
  const [id, message] = data

  const abortController = new AbortController()
  messageAbortControllers.set(id, abortController)
  const cleanupAbortController = () => {
    messageAbortControllers.delete(id)
  }

  if (message.cmd === 'abort') {
    const ac = messageAbortControllers.get(message.params)
    ac?.abort()
    postMessage([
      id,
      {
        success: Boolean(ac),
        result: ac ? undefined : new Error(`Abort controller not found for event id: ${id}`),
      },
    ])
    cleanupAbortController()
    return
  }

  if (message.cmd === 'multicallChunk') {
    fetchChunk(message.params.chainId, message.params.chunk, message.params.minBlockNumber)
      .then((res) => {
        postMessage([
          id,
          {
            success: true,
            result: res,
          },
        ])
      })
      .catch((err) => {
        postMessage([
          id,
          {
            success: false,
            error: err,
          },
        ])
      })
      .finally(cleanupAbortController)
    return
  }

  if (message.cmd === 'getBestTrade') {
    const parsed = SmartRouter.APISchema.zRouterPostParams.safeParse(message.params)
    if (parsed.success === false) {
      postMessage([
        id,
        {
          success: false,
          error: parsed.error.message,
        },
      ])
      cleanupAbortController()
      return
    }

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
    const onChainProvider = createViemPublicClientGetter({ transportSignal: abortController.signal })
    const onChainQuoteProvider = SmartRouter.createQuoteProvider({ onChainProvider, gasLimit })
    const currencyAAmount = parseCurrencyAmount(chainId, amount)

    const currencyB = parseCurrency(chainId, currency)

    const pools = candidatePools.map((pool) => parsePool(chainId, pool as any))

    const gasPrice = gasPriceWei
      ? BigInt(gasPriceWei)
      : async () => BigInt((await onChainProvider({ chainId }).getGasPrice()).toString())

    SmartRouter.getBestTrade(currencyAAmount, currencyB, tradeType, {
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
      signal: abortController.signal,
    })
      .then((res) => {
        postMessage([
          id,
          {
            success: true,
            result: res && serializeTrade(res),
          },
        ])
      })
      .catch((err) => {
        postMessage([
          id,
          {
            success: false,
            error: err.message,
          },
        ])
      })
      .finally(cleanupAbortController)
  }

  if (message.cmd === 'getBestTradeOffchain') {
    const parsed = V4Router.APISchema.zRouterPostParams.safeParse(message.params)
    if (parsed.success === false) {
      postMessage([
        id,
        {
          success: false,
          error: parsed.error.message,
        },
      ])
      cleanupAbortController()
      return
    }

    const { amount, chainId, currency, tradeType, gasPriceWei, maxHops, candidatePools, maxSplits } = parsed.data
    const onChainProvider = createViemPublicClientGetter({ transportSignal: abortController.signal })
    const currencyAAmount = parseCurrencyAmount(chainId, amount)
    const currencyB = parseCurrency(chainId, currency)
    // FIXME: typing issue
    const pools = candidatePools.map((pool) => parsePool(chainId, pool as any))

    const gasPrice = gasPriceWei
      ? BigInt(gasPriceWei)
      : async () => BigInt((await onChainProvider({ chainId }).getGasPrice()).toString())

    const initializedPools = pools.map(toRoutingSDKPool)

    findBestTrade({
      amount: currencyAAmount,
      quoteCurrency: currencyB,
      tradeType,
      gasPriceWei: gasPrice,
      candidatePools: initializedPools,
      maxHops,
      maxSplits,
    })
      .then((t) => {
        if (!t) {
          throw new Error('No valid trade route found')
        }
        const { graph: _, ...trade } = t

        const v4Trade = toSerializableV4Trade(trade)
        postMessage([
          id,
          {
            success: true,
            result: v4Trade,
          },
        ])
      })
      .catch((e) => {
        postMessage([
          id,
          {
            success: false,
            error: e.message,
          },
        ])
      })
      .finally(cleanupAbortController)
  }
})
