import { WNATIVE } from '@pancakeswap/sdk'
import { Token } from '@pancakeswap/swap-sdk-core'
import { CAKE, unwrappedToken } from '@pancakeswap/tokens'
import { priceHelperTokens } from '../constants/common'
import { ComputedFarmConfigV3, FarmConfigV3, UniversalFarmConfigV3 } from './types'

function sortFarmLP(token0: Token, token1: Token) {
  const commonTokens = priceHelperTokens[token0.chainId as keyof typeof priceHelperTokens]
  if (commonTokens) {
    const commonTokensList = [
      WNATIVE[token0.chainId as keyof typeof WNATIVE],
      ...commonTokens.list,
      CAKE[token0.chainId as keyof typeof CAKE] ? CAKE[token0.chainId as keyof typeof CAKE] : undefined,
    ].filter(Boolean) as Token[]
    const someToken0 = commonTokensList.some((token) => token.equals(token0))
    const someToken1 = commonTokensList.some((token) => token.equals(token1))
    if (someToken0 && someToken1) {
      return commonTokensList.indexOf(token0) > commonTokensList.indexOf(token1) ? [token0, token1] : [token1, token0]
    }
    if (someToken0) {
      return [token1, token0]
    }
    if (someToken1) {
      return [token0, token1]
    }
  }

  return [token0, token1]
}

export function defineFarmV3Configs(farmConfig: FarmConfigV3[]): ComputedFarmConfigV3[] {
  return farmConfig.map((config) => {
    const [token, quoteToken] = sortFarmLP(config.token0, config.token1)
    const unwrappedToken0 = unwrappedToken(token)
    const unwrappedToken1 = unwrappedToken(quoteToken)

    if (!unwrappedToken0 || !unwrappedToken1) {
      throw new Error(`Invalid farm config token0: ${token.address} or token1: ${quoteToken.address}`)
    }

    return {
      ...config,
      token,
      quoteToken,
      lpSymbol: `${unwrappedToken0.symbol}-${unwrappedToken1.symbol} LP`,
    }
  })
}

export function defineFarmV3ConfigsFromUniversalFarm(farms: UniversalFarmConfigV3[]): ComputedFarmConfigV3[] {
  return farms
    .filter((f) => !!f.pid)
    .map((farm) => {
      const [token, quoteToken] = sortFarmLP(farm.token0, farm.token1)
      const unwrappedToken0 = unwrappedToken(token)
      const unwrappedToken1 = unwrappedToken(quoteToken)

      if (!unwrappedToken0 || !unwrappedToken1) {
        throw new Error(`Invalid farm config token0: ${token.address} or token1: ${quoteToken.address}`)
      }

      const f: ComputedFarmConfigV3 = {
        pid: farm.pid,
        lpSymbol: `${unwrappedToken0.symbol}-${unwrappedToken1.symbol} LP`,
        lpAddress: farm.lpAddress,

        token,
        quoteToken,
        feeAmount: farm.feeAmount,

        token0: farm.token0,
        token1: farm.token1,
      }
      if (farm.chainId === 56 && (farm.pid === 46 || farm.pid === 47)) {
        f.isCommunity = true
      }

      return f
    })
}
