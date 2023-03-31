import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { ChainId, TradeType, JSBI } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { PoolType, SmartRouter } from '@pancakeswap/smart-router/evm'

import { parsePool, parseCurrencyAmount, parseCurrency, serializeTrade } from 'utils/routingApi'
import { provider } from 'utils/providers'

export const config = {
  runtime: 'experimental-edge',
}

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

const onChainQuoteProvider = SmartRouter.createQuoteProvider({ onChainProvider: provider })

const edgeFunction = async (req: NextRequest) => {
  if (req.method !== 'POST') return new Response(null, { status: 404, statusText: 'Not Found' })

  const body = await req.json()
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

    return NextResponse.json(trade && serializeTrade(trade))
  } catch (e) {
    return new Response(null, { status: 500, statusText: 'No valid trade' })
  }
}

export default edgeFunction
