import { BigintIsh, Currency, CurrencyAmount, Price } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import sum from 'lodash/sum.js'

import {
  BASE_SWAP_COST_STABLE_SWAP,
  BASE_SWAP_COST_V2,
  BASE_SWAP_COST_V3,
  COST_PER_EXTRA_HOP_STABLE_SWAP,
  COST_PER_EXTRA_HOP_V2,
  COST_PER_HOP_V3,
  COST_PER_INIT_TICK,
  COST_PER_UNINIT_TICK,
} from '../constants'
import {
  GasCost,
  GasEstimateRequiredInfo,
  GasModel,
  Pool,
  PoolProvider,
  PoolType,
  PriceReferences,
  RouteWithoutGasEstimate,
} from './types'
import { getNativeWrappedToken, getTokenPrice, getUsdGasToken, isStablePool, isV2Pool, isV3Pool } from './utils'

type GasModelConfig = {
  gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
  blockNumber?: BigintIsh
  poolProvider: PoolProvider
  quoteCurrency: Currency
} & PriceReferences

function getTokenPriceByNumber(baseCurrency: Currency, quoteCurrency: Currency, price: number) {
  const quoteAmount = tryParseAmount(String(price), baseCurrency)
  const baseAmount = tryParseAmount('1', quoteCurrency)
  if (!baseAmount || !quoteAmount) {
    return undefined
  }

  return new Price({ baseAmount, quoteAmount })
}

export async function createGasModel({
  gasPriceWei,
  poolProvider,
  quoteCurrency,
  blockNumber,
  quoteCurrencyUsdPrice,
  nativeCurrencyUsdPrice,
}: GasModelConfig): Promise<GasModel> {
  const { chainId } = quoteCurrency
  const usdToken = getUsdGasToken(chainId)
  if (!usdToken) {
    throw new Error(`No valid usd token found on chain ${chainId}`)
  }
  const nativeWrappedToken = getNativeWrappedToken(chainId)
  if (!nativeWrappedToken) {
    throw new Error(`Unsupported chain ${chainId}. Native wrapped token not found.`)
  }

  const gasPrice = BigInt(typeof gasPriceWei === 'function' ? await gasPriceWei() : gasPriceWei)
  const [usdPool, nativePool] = await Promise.all([
    getHighestLiquidityUSDPool(poolProvider, chainId, blockNumber),
    getHighestLiquidityNativePool(poolProvider, quoteCurrency, blockNumber),
  ])
  const priceInUsd = quoteCurrencyUsdPrice
    ? getTokenPriceByNumber(usdToken, quoteCurrency, quoteCurrencyUsdPrice)
    : undefined
  const nativePriceInUsd = nativeCurrencyUsdPrice
    ? getTokenPriceByNumber(usdToken, nativeWrappedToken, nativeCurrencyUsdPrice)
    : undefined
  const priceInNative = priceInUsd && nativePriceInUsd ? nativePriceInUsd.multiply(priceInUsd.invert()) : undefined

  const estimateGasCost = (
    { pools }: RouteWithoutGasEstimate,
    { initializedTickCrossedList }: GasEstimateRequiredInfo,
  ): GasCost => {
    const isQuoteNative = nativeWrappedToken.equals(quoteCurrency.wrapped)

    const totalInitializedTicksCrossed = BigInt(Math.max(1, sum(initializedTickCrossedList)))
    /**
     * Since we must make a separate call to multicall for each v3 and v2 section, we will have to
     * add the BASE_SWAP_COST to each section.
     */
    const poolTypeSet = new Set<PoolType>()
    let baseGasUse = 0n

    for (const pool of pools) {
      const { type } = pool
      if (isV2Pool(pool)) {
        if (!poolTypeSet.has(type)) {
          baseGasUse += BASE_SWAP_COST_V2
          poolTypeSet.add(type)
          continue
        }
        baseGasUse += COST_PER_EXTRA_HOP_V2
        continue
      }

      if (isV3Pool(pool)) {
        if (!poolTypeSet.has(type)) {
          baseGasUse += BASE_SWAP_COST_V3(chainId)
          poolTypeSet.add(type)
        }
        baseGasUse += COST_PER_HOP_V3(chainId)
        continue
      }

      if (isStablePool(pool)) {
        if (!poolTypeSet.has(type)) {
          baseGasUse += BASE_SWAP_COST_STABLE_SWAP
          poolTypeSet.add(type)
          continue
        }
        baseGasUse += COST_PER_EXTRA_HOP_STABLE_SWAP
        continue
      }
    }

    const tickGasUse = COST_PER_INIT_TICK(chainId) * totalInitializedTicksCrossed
    const uninitializedTickGasUse = COST_PER_UNINIT_TICK * 0n

    // base estimate gas used based on chainId estimates for hops and ticks gas usage
    baseGasUse = baseGasUse + tickGasUse + uninitializedTickGasUse

    const baseGasCostWei = gasPrice * baseGasUse

    const totalGasCostNativeCurrency = CurrencyAmount.fromRawAmount(nativeWrappedToken, baseGasCostWei)

    let gasCostInToken: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, 0)
    let gasCostInUSD: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(usdToken, 0)

    try {
      if (isQuoteNative) {
        gasCostInToken = totalGasCostNativeCurrency
      }
      if (!isQuoteNative) {
        const price =
          priceInNative || (nativePool && getTokenPrice(nativePool, nativeWrappedToken, quoteCurrency.wrapped))
        if (price) {
          gasCostInToken = price.quote(totalGasCostNativeCurrency)
        }
      }

      const nativeTokenUsdPrice = nativePriceInUsd || (usdPool && getTokenPrice(usdPool, nativeWrappedToken, usdToken))
      if (nativeTokenUsdPrice) {
        gasCostInUSD = nativeTokenUsdPrice.quote(totalGasCostNativeCurrency)
      }
    } catch (e) {
      // console.warn('Cannot estimate gas cost', e)
    }
    return {
      gasEstimate: baseGasUse,
      gasCostInToken,
      gasCostInUSD,
    }
  }

  return {
    estimateGasCost,
  }
}

async function getHighestLiquidityNativePool(
  poolProvider: PoolProvider,
  currency: Currency,
  blockNumber?: BigintIsh,
): Promise<Pool | null> {
  const nativeWrappedToken = getNativeWrappedToken(currency.chainId)
  if (!nativeWrappedToken || currency.wrapped.equals(nativeWrappedToken)) {
    return null
  }

  const pools = await poolProvider.getCandidatePools({
    blockNumber,
    pairs: [[nativeWrappedToken, currency]],
    currencyA: nativeWrappedToken,
    currencyB: currency,
  })
  // TODO get the first pool we have for now
  return pools[0] ?? null
}

async function getHighestLiquidityUSDPool(
  poolProvider: PoolProvider,
  chainId: ChainId,
  blockNumber?: BigintIsh,
): Promise<Pool | null> {
  const usdToken = getUsdGasToken(chainId)
  const nativeWrappedToken = getNativeWrappedToken(chainId)
  if (!usdToken || !nativeWrappedToken) {
    return null
  }
  const pools = await poolProvider.getCandidatePools({
    blockNumber,
    pairs: [[nativeWrappedToken, usdToken]],
    currencyA: nativeWrappedToken,
    currencyB: usdToken,
  })
  // TODO get the first pool we have for now
  return pools[0] ?? null
}
