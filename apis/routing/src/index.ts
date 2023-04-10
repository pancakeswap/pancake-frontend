/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { CORS_ALLOW, handleCors, wrapCorsHeader } from '@pancakeswap/worker-utils'
import { Router } from 'itty-router'
import { error, json, missing } from 'itty-router-extras'
import { z } from 'zod'
import { ChainId, Currency, JSBI, TradeType } from '@pancakeswap/sdk'
import { PoolType, SmartRouter, StablePool, V2Pool, V3Pool } from '@pancakeswap/smart-router/evm'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { GraphQLClient } from 'graphql-request'
import { viemProviders } from './provider'
import { sendLog } from './log'

const { parseCurrency, parseCurrencyAmount, parsePool, serializeTrade } = SmartRouter.Transformer

const zChainId = z.nativeEnum(ChainId)
const zFee = z.nativeEnum(FeeAmount)
const zTradeType = z.nativeEnum(TradeType)
const zPoolType = z.nativeEnum(PoolType)
const zPoolTypes = z.array(zPoolType)
const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/)
const zBigNumber = z.string().regex(/^[0-9]+$/)
const zCurrency = z
  .object({
    address: zAddress,
    decimals: z.number(),
    symbol: z.string(),
  })
  .required()
const zCurrencyAmount = z
  .object({
    currency: zCurrency,
    value: zBigNumber,
  })
  .required()

const zV2Pool = z
  .object({
    type: zPoolType,
    reserve0: zCurrencyAmount,
    reserve1: zCurrencyAmount,
  })
  .required()
const zV3Pool = z
  .object({
    type: zPoolType,
    token0: zCurrency,
    token1: zCurrency,
    fee: zFee,
    liquidity: zBigNumber,
    sqrtRatioX96: zBigNumber,
    tick: z.number(),
    address: zAddress,
    token0ProtocolFee: z.string(),
    token1ProtocolFee: z.string(),
  })
  .required()
const zStablePool = z
  .object({
    type: zPoolType,
    balances: z.array(zCurrencyAmount),
    amplifier: zBigNumber,
    fee: z.string(),
  })
  .required()
const zPools = z.array(z.union([zV2Pool, zV3Pool, zStablePool]))

const zGetParams = z
  .object({
    chainId: zChainId,
    tradeType: zTradeType,
    amount: zCurrencyAmount,
    currency: zCurrency,
    gasPriceWei: zBigNumber.optional(),
    maxHops: z.number().optional(),
    maxSplits: z.number().optional(),
    blockNumber: zBigNumber.optional(),
    poolTypes: zPoolTypes.optional(),
  })
  .required({
    chainId: true,
    tradeType: true,
    amount: true,
    currency: true,
    candidatePools: true,
  })

const zPostParams = z
  .object({
    chainId: zChainId,
    tradeType: zTradeType,
    amount: zCurrencyAmount,
    currency: zCurrency,
    candidatePools: zPools,
    gasPriceWei: zBigNumber.optional(),
    maxHops: z.number().optional(),
    maxSplits: z.number().optional(),
    blockNumber: zBigNumber.optional(),
    poolTypes: zPoolTypes.optional(),
  })
  .required({
    chainId: true,
    tradeType: true,
    amount: true,
    currency: true,
    candidatePools: true,
  })

const router = Router()

const CACHE_TIME = {
  [ChainId.ETHEREUM]: 10,
  [ChainId.GOERLI]: 10,
  [ChainId.BSC]: 2,
  [ChainId.BSC_TESTNET]: 2,
}

const V3_SUBGRAPH_URLS = {
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-eth',
  [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-goerli',
  [ChainId.BSC]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc',
  [ChainId.BSC_TESTNET]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-chapel',
}

const onChainQuoteProvider = SmartRouter.createQuoteProvider({ onChainProvider: viemProviders })

const v3Clients = {
  [ChainId.ETHEREUM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ETHEREUM], { fetch }),
  [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.GOERLI], { fetch }),
  [ChainId.BSC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC], { fetch }),
  [ChainId.BSC_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC_TESTNET], { fetch }),
}

const subgraphProvider = ({ chainId }: { chainId?: ChainId }) => {
  return v3Clients[chainId as ChainId]
}

const PoolCache = {
  getKey: (currencyA: Currency, currencyB: Currency, chainId: ChainId) => {
    return `${currencyA.symbol}-${currencyB.symbol}-${chainId}:pool-v1`
  },
  get: (cacheKey: string) => {
    return POOLS.get<{
      v3Pools: V3Pool[]
      v2Pools: V2Pool[]
      stablePools: StablePool[]
    }>(cacheKey, { type: 'json' })
  },
  set: (key: string, value: any) => {
    return POOLS.put(key, value, {
      expirationTtl: 900,
    })
  },
}

async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = await new TextEncoder().encode(message)
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  // convert bytes to hex string
  return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

router.get('/v0/quote', async (req, event: FetchEvent) => {
  const parsed = zGetParams.safeParse(req.query)
  if (parsed.success === false) {
    return error(400, 'Invalid params')
  }

  const { amount, chainId, currency, tradeType, blockNumber, gasPriceWei, maxHops, maxSplits, poolTypes } = parsed.data

  const gasPrice = gasPriceWei
    ? JSBI.BigInt(gasPriceWei)
    : async () => JSBI.BigInt(await (await viemProviders({ chainId }).getGasPrice()).toString())

  const currencyAAmount = parseCurrencyAmount(chainId, amount)
  const currencyA = currencyAAmount.currency
  const currencyB = parseCurrency(chainId, currency)

  const cacheKey = PoolCache.getKey(currencyA, currencyB, chainId)

  let pools = await PoolCache.get(cacheKey)

  if (!pools) {
    const pairs = SmartRouter.getPairCombinations(currencyA, currencyB)

    const [v3Pools, v2Pools, stablePools] = await Promise.all([
      SmartRouter.getV3PoolSubgraph({ provider: subgraphProvider, pairs }).then((res) =>
        SmartRouter.v3PoolSubgraphSelection(currencyA, currencyB, res),
      ),
      SmartRouter.getV2PoolsOnChain(pairs, viemProviders, blockNumber),
      SmartRouter.getStablePoolsOnChain(pairs, viemProviders, blockNumber),
    ])

    pools = {
      v3Pools,
      v2Pools,
      stablePools,
    }

    event.waitUntil(PoolCache.set(cacheKey, pools))
  }

  try {
    const trade = await SmartRouter.getBestTrade(currencyAAmount, currencyB, tradeType, {
      gasPriceWei: gasPrice,
      poolProvider: SmartRouter.createStaticPoolProvider([...pools.v3Pools, ...pools.v2Pools, ...pools.stablePools]),
      quoteProvider: onChainQuoteProvider,
      maxHops,
      maxSplits,
      blockNumber: Number(blockNumber),
      allowedPoolTypes: poolTypes,
      quoterOptimization: false,
    })
    return json(trade ? serializeTrade(trade) : {})
  } catch (e) {
    return error(500, e instanceof Error ? e.message : 'No valid trade')
  }
})

function timeout(seconds: number) {
  return new Promise<null>((resolve) =>
    setTimeout(() => {
      resolve(null)
    }, seconds * 1_000),
  )
}

router.post('/v0/quote', async (req, event) => {
  const body = (await req.json?.()) as any
  const parsed = zPostParams.safeParse(body)
  if (parsed.success === false) {
    return error(400, 'Invalid params')
  }

  const hash = await sha256(JSON.stringify(body))

  const cacheUrl = new URL(req.url)
  cacheUrl.pathname = `/posts${cacheUrl.pathname}${hash}`
  const cacheKey = new Request(cacheUrl.toString(), {
    // @ts-ignore
    headers: req.headers,
    method: 'GET',
  })

  const cache = caches.default
  const cacheResponse = await cache.match(cacheKey)
  let response

  if (!cacheResponse) {
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

    const gasPrice = gasPriceWei
      ? JSBI.BigInt(gasPriceWei)
      : async () => JSBI.BigInt(await (await viemProviders({ chainId }).getGasPrice()).toString())

    const currencyAAmount = parseCurrencyAmount(chainId, amount)
    const currencyB = parseCurrency(chainId, currency)

    const pools = candidatePools.map((pool) => parsePool(chainId, pool as any))

    try {
      const getTrade = async () => {
        const trade = await SmartRouter.getBestTrade(currencyAAmount, currencyB, tradeType, {
          gasPriceWei: gasPrice,
          poolProvider: SmartRouter.createStaticPoolProvider(pools),
          quoteProvider: onChainQuoteProvider,
          maxHops,
          maxSplits,
          blockNumber: Number(blockNumber),
          allowedPoolTypes: poolTypes,
          quoterOptimization: false,
        })

        if (!trade) {
          throw new Error('No valid trade')
        }

        return trade
      }

      const res = await Promise.race([timeout(30), getTrade()])
      if (!res) {
        throw new Error('Timeout')
      }

      response = json(serializeTrade(res), {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_TIME[chainId] ?? '5'}`,
        },
      })
      event.waitUntil(cache.put(cacheKey, response.clone()))
    } catch (e) {
      event.waitUntil(sendLog(e))
      response = error(500, e instanceof Error ? e.message : 'No valid trade')
    }
  } else {
    sendLog({ message: 'cache hit', url: cacheUrl.toString() })
    response = new Response(cacheResponse.body, cacheResponse)
  }

  return response
})

router.options('*', handleCors(CORS_ALLOW, `GET, POST, OPTIONS`, `*`))

router.all('*', () => missing('Not found'))

addEventListener('fetch', (event) =>
  event.respondWith(
    router
      .handle(event.request, event)
      .then((res) => wrapCorsHeader(event.request, res, { allowedOrigin: CORS_ALLOW })),
  ),
)
