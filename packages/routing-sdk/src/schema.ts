import { TradeType } from '@pancakeswap/swap-sdk-core'
import { ChainId } from '@pancakeswap/chains'
import { z, ZodObject } from 'zod'

import { Address } from './types'

const zChainId = z.nativeEnum(ChainId)
const zTradeType = z.nativeEnum(TradeType)
const zAddress = z.custom<Address>((val) => /^0x[a-fA-F0-9]{40}$/.test(val as string))
const zBigNumber = z.string().regex(/^[0-9]+$/)
const zCurrency = z
  .object({
    address: zAddress,
    decimals: z.number(),
    symbol: z.string(),
  })
  .required()
const zCurrencyAmountBase = z.object({
  currency: zCurrency.required(),
  value: zBigNumber,
})
const zCurrencyAmount = zCurrencyAmountBase.required()

type GetRouterPostParamsSchemaOptions = {
  zCandidatePools: ZodObject<any>
}

export function getRouterPostParamsSchema({ zCandidatePools }: GetRouterPostParamsSchemaOptions) {
  return z
    .object({
      chainId: zChainId,
      tradeType: zTradeType,
      amount: zCurrencyAmount,
      currency: zCurrency,
      candidatePools: zCandidatePools,
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
}

export type RouterPostParams = z.infer<ReturnType<typeof getRouterPostParamsSchema>>
