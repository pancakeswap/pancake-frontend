import { JSBI } from '@pancakeswap/sdk'
import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { viemClients } from 'utils/viem'

const { parseCurrency, parseCurrencyAmount, parsePool, serializeTrade } = SmartRouter.Transformer

export type WorkerEvent = [
  id: number,
  message: {
    cmd: 'getBestTrade'
    params: any
  },
]

const onChainQuoteProvider = SmartRouter.createQuoteProvider({ onChainProvider: viemClients })

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<WorkerEvent>) => {
  const { data } = event
  const [id, message] = data
  if (message.cmd === 'getBestTrade') {
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
    } = message.params
    const currencyAAmount = parseCurrencyAmount(chainId, amount)
    const currencyB = parseCurrency(chainId, currency)

    const pools = candidatePools.map((pool) => parsePool(chainId, pool as any))

    const gasPrice = gasPriceWei
      ? JSBI.BigInt(gasPriceWei)
      : async () => JSBI.BigInt(await (await viemClients({ chainId }).getGasPrice()).toString())

    SmartRouter.getBestTrade(currencyAAmount, currencyB, tradeType, {
      gasPriceWei: gasPrice,
      poolProvider: SmartRouter.createStaticPoolProvider(pools),
      quoteProvider: onChainQuoteProvider,
      maxHops,
      maxSplits,
      blockNumber: Number(blockNumber),
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
