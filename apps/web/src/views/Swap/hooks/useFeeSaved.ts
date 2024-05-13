import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { DAI, USDC, USDT } from '@pancakeswap/tokens'
import { useMemo } from 'react'

const MAJOR_DEFINED_STABLE_COINS = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], DAI[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  [ChainId.ARBITRUM_ONE]: [USDC[ChainId.ARBITRUM_ONE]],
  [ChainId.ARBITRUM_GOERLI]: [USDC[ChainId.ARBITRUM_GOERLI]],
  [ChainId.POLYGON_ZKEVM]: [USDC[ChainId.POLYGON_ZKEVM], DAI[ChainId.POLYGON_ZKEVM]],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [USDC[ChainId.POLYGON_ZKEVM_TESTNET]],
  [ChainId.BSC]: [USDC[ChainId.BSC]],
  [ChainId.BASE]: [USDC[ChainId.BASE]],
  [ChainId.SEPOLIA]: [USDC[ChainId.SEPOLIA]],
}

export const useFeeSaved = (inputAmount?: CurrencyAmount<Currency>, outputAmount?: CurrencyAmount<Currency>) => {
  return useMemo(() => {
    if (!inputAmount || !outputAmount) return null

    const { chainId } = inputAmount.currency

    const majorDefinedStableCoins = MAJOR_DEFINED_STABLE_COINS[chainId] ?? []
    const zeroFee = [inputAmount.currency, outputAmount.currency].every((currency) =>
      majorDefinedStableCoins.some((coin) => coin.equals(currency)),
    )

    if (zeroFee) return null

    return inputAmount.multiply(25).divide(10000)
  }, [inputAmount, outputAmount])
}
