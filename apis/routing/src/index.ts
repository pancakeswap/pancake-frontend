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

import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { handleCors, wrapCorsHeader } from '@pancakeswap/worker-utils'
import { Router } from 'itty-router'
import { missing, error, json } from 'itty-router-extras'
import { z } from 'zod'

import { ChainId, JSBI, TradeType } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { PoolType, SmartRouter } from '@pancakeswap/smart-router/evm'
import { parseCurrency, parseCurrencyAmount, parsePool, serializeTrade } from './utils'

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

const zParams = z
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

router.post('/v0/quote', async (req) => {
  const bscProvider = new StaticJsonRpcProvider(
    {
      url: 'https://nodes.pancakeswap.info',
      skipFetchSetup: true,
    },
    56,
  )

  const bscTestnetProvider = new StaticJsonRpcProvider(
    {
      url: 'https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5',
      skipFetchSetup: true,
    },
    97,
  )

  const goerliProvider = new StaticJsonRpcProvider(
    {
      url: 'https://eth-goerli.nodereal.io/v1/8a4432e42df94dcca2814fde8aea2a2e',
      skipFetchSetup: true,
    },
    5,
  )

  const ethProvider = new StaticJsonRpcProvider(
    {
      url: 'https://eth-goerli.nodereal.io/v1/8a4432e42df94dcca2814fde8aea2a2e',
      skipFetchSetup: true,
    },
    1,
  )

  const provider = ({ chainId }: { chainId?: ChainId }) => {
    if (chainId === ChainId.BSC_TESTNET) {
      return bscTestnetProvider
    }
    if (chainId === ChainId.BSC) {
      return bscProvider
    }
    if (chainId === ChainId.ETHEREUM) {
      return ethProvider
    }
    if (chainId === ChainId.GOERLI) {
      return goerliProvider
    }
    return bscProvider
  }
  const body = (await req.json?.()) as any
  const onChainQuoteProvider = SmartRouter.createQuoteProvider({ onChainProvider: provider })
  const parsed = zParams.safeParse(body)
  if (parsed.success === false) {
    return new Response(null, { status: 400, statusText: 'Invalid params' })
  }

  const { data } = parsed
  const { chainId, tradeType, gasPriceWei, maxHops, maxSplits, blockNumber, poolTypes } = data
  const amount = parseCurrencyAmount(chainId, data.amount as any)
  const currency = parseCurrency(chainId, data.currency as any)
  const pools = data.candidatePools.map((pool) => parsePool(chainId, pool as any))
  const gasPrice = gasPriceWei
    ? JSBI.BigInt(gasPriceWei)
    : async () => JSBI.BigInt(await provider({ chainId }).getGasPrice())

  try {
    const trade = await SmartRouter.getBestTrade(amount, currency, tradeType, {
      gasPriceWei: gasPrice,
      poolProvider: SmartRouter.createStaticPoolProvider(pools),
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

router.options('*', handleCors('*', `POST, OPTIONS`, `*`))

router.all('*', () => missing('Not found'))

addEventListener('fetch', (event) =>
  event.respondWith(
    router.handle(event.request, event).then((res) => wrapCorsHeader(event.request, res, { allowedOrigin: '*' })),
  ),
)
