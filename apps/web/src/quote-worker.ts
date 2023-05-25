import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { viemClients } from 'utils/viem'
import { log } from 'next-axiom'

const { parseCurrency, parseCurrencyAmount, parsePool, serializeTrade } = SmartRouter.Transformer

export type WorkerEvent = [
  id: number,
  message: {
    cmd: 'getBestTrade'
    params: SmartRouter.APISchema.RouterPostParams
  },
]

const fetch_ = fetch

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
    log.info('QuoteRPC', {
      url: urlString,
      size,
      time: end - start,
      status: response.status,
    })
  }

  return response
}

globalThis.fetch = fetchWithLogging

const onChainQuoteProvider = SmartRouter.createQuoteProvider({ onChainProvider: viemClients })

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<WorkerEvent>) => {
  const { data } = event
  const [id, message] = data
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
    } = parsed.data
    const currencyAAmount = parseCurrencyAmount(chainId, amount)
    const currencyB = parseCurrency(chainId, currency)

    const pools = candidatePools.map((pool) => parsePool(chainId, pool as any))

    const gasPrice = gasPriceWei
      ? BigInt(gasPriceWei)
      : async () => BigInt(await (await viemClients({ chainId }).getGasPrice()).toString())

    SmartRouter.getBestTrade(currencyAAmount, currencyB, tradeType, {
      gasPriceWei: gasPrice,
      poolProvider: SmartRouter.createStaticPoolProvider(pools),
      quoteProvider: onChainQuoteProvider,
      maxHops,
      maxSplits,
      blockNumber: blockNumber ? Number(blockNumber) : undefined,
      allowedPoolTypes: poolTypes,
      quoterOptimization: false,
    })
      .then((res) => {
        postMessage([
          id,
          {
            success: true,
            result: serializeTrade(res),
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
  }
})
