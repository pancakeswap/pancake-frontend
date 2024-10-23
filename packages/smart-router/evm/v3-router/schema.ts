import { TradeType } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Address } from 'viem'
import { z } from 'zod'
import { PoolType } from './types'

const zChainId = z.nativeEnum(ChainId)
const zFee = z.nativeEnum(FeeAmount)
const zTradeType = z.nativeEnum(TradeType)
const zPoolType = z.nativeEnum(PoolType)
const zPoolTypes = z.array(zPoolType)
const zAddress = z.custom<Address>((val) => /^0x[a-fA-F0-9]{40}$/.test(val as string))
const zHex = z.custom<Address>((val) => /^0x[a-fA-F0-9]*$/.test(val as string))
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
    currency: zCurrency.required(),
    value: zBigNumber,
  })
  .required()

const zV2Pool = z
  .object({
    type: z.literal(PoolType.V2),
    reserve0: zCurrencyAmount,
    reserve1: zCurrencyAmount,
  })
  .required()
const zV3Pool = z
  .object({
    type: z.literal(PoolType.V3),
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
    type: z.literal(PoolType.STABLE),
    balances: z.array(zCurrencyAmount),
    amplifier: zBigNumber,
    fee: z.string(),
  })
  .required()
const zV4ClPool = z
  .object({
    type: z.literal(PoolType.V4CL),
    currency0: zCurrency,
    currency1: zCurrency,
    fee: zFee,
    liquidity: zBigNumber,
    sqrtRatioX96: zBigNumber,
    tick: z.number(),
    tickSpacing: z.number(),
    poolManager: zAddress,
    id: zHex,
  })
  .required()
  .extend({
    hooks: zAddress.optional(),
  })

export const zPools = z.array(z.union([zV2Pool, zV3Pool, zStablePool, zV4ClPool]))

export const zRouterGetParams = z
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

export const zRouterPostParams = z
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
    onChainQuoterGasLimit: zBigNumber.optional(),
    nativeCurrencyUsdPrice: z.number().optional(),
    quoteCurrencyUsdPrice: z.number().optional(),
  })
  .required({
    chainId: true,
    tradeType: true,
    amount: true,
    currency: true,
    candidatePools: true,
  })

export type RouterPostParams = z.infer<typeof zRouterPostParams>
export type RouterGetParams = z.infer<typeof zRouterGetParams>
export type SerializedPools = z.infer<typeof zPools>
