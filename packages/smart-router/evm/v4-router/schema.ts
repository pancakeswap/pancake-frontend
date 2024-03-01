import { TradeType } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Address } from 'viem'
import { z } from 'zod'

import { PoolType } from '../v3-router/types'

const zChainId = z.nativeEnum(ChainId)
const zFee = z.nativeEnum(FeeAmount)
const zTradeType = z.nativeEnum(TradeType)
const zAddress = z.custom<Address>((val) => /^0x[a-fA-F0-9]{40}$/.test(val as string))
const zBigNumber = z.string().regex(/^[0-9]+$/)
const zSignedBigInt = z.string().regex(/^-?[0-9]+$/)
const zCurrency = z
  .object({
    address: zAddress,
    decimals: z.number(),
    symbol: z.string(),
  })
  .required()
const zTick = z
  .object({
    index: z.number(),
    liquidityGross: zSignedBigInt,
    liquidityNet: zSignedBigInt,
  })
  .required()
const zCurrencyAmountBase = z.object({
  currency: zCurrency.required(),
  value: zBigNumber,
})
const zCurrencyAmountOptional = zCurrencyAmountBase.optional()
const zCurrencyAmount = zCurrencyAmountBase.required()

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
    reserve0: zCurrencyAmountOptional,
    reserve1: zCurrencyAmountOptional,
    ticks: z.array(zTick).optional(),
  })
  .required({
    type: true,
    token0: true,
    token1: true,
    fee: true,
    liquidity: true,
    sqrtRatioX96: true,
    tick: true,
    address: true,
    token0ProtocolFee: true,
    token1ProtocolFee: true,
  })
const zStablePool = z
  .object({
    type: z.literal(PoolType.STABLE),
    balances: z.array(zCurrencyAmount),
    amplifier: zBigNumber,
    fee: z.string(),
  })
  .required()

export const zPools = z.array(z.union([zV3Pool, zV2Pool, zStablePool]))

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
  })
  .required({
    chainId: true,
    tradeType: true,
    amount: true,
    currency: true,
    candidatePools: true,
  })

export type RouterPostParams = z.infer<typeof zRouterPostParams>
export type SerializedPools = z.infer<typeof zPools>
