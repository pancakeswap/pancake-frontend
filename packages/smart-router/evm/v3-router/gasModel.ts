import { BigintIsh, ChainId, Currency, CurrencyAmount, JSBI } from '@pancakeswap/sdk'

import { GasCost, GasModel, Pool, PoolProvider, RouteWithoutGasEstimate } from './types'
import { getUsdGasToken } from './utils'

interface GasModelConfig {
  gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
  poolProvider: PoolProvider
  quoteCurrency: Currency
}

export async function createGasModel({ gasPriceWei, poolProvider, quoteCurrency }: GasModelConfig): Promise<GasModel> {
  const usdToken = getUsdGasToken(quoteCurrency.chainId)
  if (!usdToken) {
    throw new Error(`No valid usd token found on chain ${quoteCurrency.chainId}`)
  }

  const gasPrice = typeof gasPriceWei === 'function' ? await gasPriceWei() : gasPriceWei
  const [usdPool, nativePool] = await Promise.all([
    getHighestLiquidityUSDPool(poolProvider, quoteCurrency.chainId),
    getHighestLiquidityNativePool(poolProvider, quoteCurrency),
  ])
  const estimateGasCost = (route: RouteWithoutGasEstimate): GasCost => {
    if (!usdPool || !nativePool) {
      return {
        gasEstimate: JSBI.BigInt(0),
        gasCostInToken: CurrencyAmount.fromRawAmount(quoteCurrency, 0),
        gasCostInUSD: CurrencyAmount.fromRawAmount(usdToken, 0),
      }
    }

    return {
      gasEstimate: JSBI.BigInt(0),
      gasCostInToken: CurrencyAmount.fromRawAmount(quoteCurrency, 0),
      gasCostInUSD: CurrencyAmount.fromRawAmount(usdToken, 0),
    }
  }

  return {
    estimateGasCost,
  }
}

async function getHighestLiquidityNativePool(poolProvider: PoolProvider, currency: Currency): Promise<Pool | null> {
  return null
}

async function getHighestLiquidityUSDPool(poolProvider: PoolProvider, chainId: ChainId): Promise<Pool | null> {
  return null
}
