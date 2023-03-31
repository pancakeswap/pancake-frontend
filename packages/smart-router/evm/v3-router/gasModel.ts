import { BigintIsh, ChainId, Currency, CurrencyAmount, JSBI } from '@pancakeswap/sdk'

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
  RouteWithoutGasEstimate,
} from './types'
import { getNativeWrappedToken, getTokenPrice, getUsdGasToken, isStablePool, isV2Pool, isV3Pool } from './utils'
import { sum } from '../utils/sum'

interface GasModelConfig {
  gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
  blockNumber: BigintIsh
  poolProvider: PoolProvider
  quoteCurrency: Currency
}

export async function createGasModel({
  gasPriceWei,
  poolProvider,
  quoteCurrency,
  blockNumber,
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

  const gasPrice = JSBI.BigInt(typeof gasPriceWei === 'function' ? await gasPriceWei() : gasPriceWei)
  const [usdPool, nativePool] = await Promise.all([
    getHighestLiquidityUSDPool(poolProvider, chainId, blockNumber),
    getHighestLiquidityNativePool(poolProvider, quoteCurrency, blockNumber),
  ])

  const estimateGasCost = (
    { pools }: RouteWithoutGasEstimate,
    { initializedTickCrossedList }: GasEstimateRequiredInfo,
  ): GasCost => {
    const isQuoteNative = nativeWrappedToken.equals(quoteCurrency.wrapped)

    const totalInitializedTicksCrossed = JSBI.BigInt(Math.max(1, sum(initializedTickCrossedList)))
    /**
     * Since we must make a separate call to multicall for each v3 and v2 section, we will have to
     * add the BASE_SWAP_COST to each section.
     */
    const poolTypeSet = new Set<PoolType>()
    let baseGasUse = JSBI.BigInt(0)

    for (const pool of pools) {
      const { type } = pool
      if (isV2Pool(pool)) {
        if (!poolTypeSet.has(type)) {
          baseGasUse = JSBI.add(baseGasUse, BASE_SWAP_COST_V2)
          poolTypeSet.add(type)
          continue
        }
        baseGasUse = JSBI.add(baseGasUse, COST_PER_EXTRA_HOP_V2)
        continue
      }

      if (isV3Pool(pool)) {
        if (!poolTypeSet.has(type)) {
          baseGasUse = JSBI.add(baseGasUse, BASE_SWAP_COST_V3(chainId))
          poolTypeSet.add(type)
        }
        baseGasUse = JSBI.add(baseGasUse, COST_PER_HOP_V3(chainId))
        continue
      }

      if (isStablePool(pool)) {
        if (!poolTypeSet.has(type)) {
          baseGasUse = JSBI.add(baseGasUse, BASE_SWAP_COST_STABLE_SWAP)
          poolTypeSet.add(type)
          continue
        }
        baseGasUse = JSBI.add(baseGasUse, COST_PER_EXTRA_HOP_STABLE_SWAP)
        continue
      }
    }

    const tickGasUse = JSBI.multiply(COST_PER_INIT_TICK(chainId), totalInitializedTicksCrossed)
    const uninitializedTickGasUse = JSBI.multiply(COST_PER_UNINIT_TICK, JSBI.BigInt(0))

    // base estimate gas used based on chainId estimates for hops and ticks gas useage
    baseGasUse = JSBI.add(JSBI.add(baseGasUse, tickGasUse), uninitializedTickGasUse)

    const baseGasCostWei = JSBI.multiply(gasPrice, baseGasUse)

    const totalGasCostNativeCurrency = CurrencyAmount.fromRawAmount(nativeWrappedToken, baseGasCostWei)

    let gasCostInToken: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, 0)
    let gasCostInUSD: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(usdToken, 0)
    if (isQuoteNative) {
      gasCostInToken = totalGasCostNativeCurrency
    }
    if (!isQuoteNative && nativePool) {
      const price = getTokenPrice(nativePool, nativeWrappedToken, quoteCurrency.wrapped)
      gasCostInToken = price.quote(totalGasCostNativeCurrency)
    }

    if (usdPool) {
      const nativeTokenUsdPrice = getTokenPrice(usdPool, nativeWrappedToken, usdToken)
      gasCostInUSD = nativeTokenUsdPrice.quote(totalGasCostNativeCurrency)
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
  blockNumber: BigintIsh,
): Promise<Pool | null> {
  const nativeWrappedToken = getNativeWrappedToken(currency.chainId)
  if (!nativeWrappedToken || currency.wrapped.equals(nativeWrappedToken)) {
    return null
  }

  const pools = await poolProvider.getPools([[nativeWrappedToken, currency]], { blockNumber })
  // TODO get the first pool we have for now
  return pools[0] ?? null
}

async function getHighestLiquidityUSDPool(
  poolProvider: PoolProvider,
  chainId: ChainId,
  blockNumber: BigintIsh,
): Promise<Pool | null> {
  const usdToken = getUsdGasToken(chainId)
  const nativeWrappedToken = getNativeWrappedToken(chainId)
  if (!usdToken || !nativeWrappedToken) {
    return null
  }
  const pools = await poolProvider.getPools([[nativeWrappedToken, usdToken]], { blockNumber })
  // TODO get the first pool we have for now
  return pools[0] ?? null
}
