import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { DAI, USDC, USDT } from '@pancakeswap/tokens'
import { useStablecoinPriceAmount } from 'hooks/useStablecoinPrice'
import { useMemo } from 'react'

const MAJOR_DEFINED_STABLE_COINS = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], DAI[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  [ChainId.ARBITRUM_ONE]: [USDC[ChainId.ARBITRUM_ONE], DAI[ChainId.ARBITRUM_ONE], USDT[ChainId.ARBITRUM_ONE]],
  [ChainId.ARBITRUM_GOERLI]: [
    USDC[ChainId.ARBITRUM_GOERLI],
    DAI[ChainId.ARBITRUM_GOERLI],
    USDT[ChainId.ARBITRUM_GOERLI],
  ],
  [ChainId.POLYGON_ZKEVM]: [USDC[ChainId.POLYGON_ZKEVM], DAI[ChainId.POLYGON_ZKEVM], USDT[ChainId.POLYGON_ZKEVM]],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [
    USDC[ChainId.POLYGON_ZKEVM_TESTNET],
    DAI[ChainId.POLYGON_ZKEVM_TESTNET],
    USDT[ChainId.POLYGON_ZKEVM_TESTNET],
  ],
  [ChainId.BSC]: [USDC[ChainId.BSC], DAI[ChainId.BSC], USDT[ChainId.BSC]],
  [ChainId.BASE]: [USDC[ChainId.BASE], DAI[ChainId.BASE], USDT[ChainId.BASE]],
  [ChainId.SEPOLIA]: [USDC[ChainId.SEPOLIA], DAI[ChainId.SEPOLIA], USDT[ChainId.SEPOLIA]],
}

export const useFeeSaved = (inputAmount?: CurrencyAmount<Currency>, outputAmount?: CurrencyAmount<Currency>) => {
  const feeSavedAmount = useMemo(() => {
    if (!inputAmount || !outputAmount) return undefined

    const { chainId } = inputAmount.currency

    const majorDefinedStableCoins = MAJOR_DEFINED_STABLE_COINS[chainId] ?? []
    const zeroFee = [inputAmount.currency, outputAmount.currency].every((currency) =>
      majorDefinedStableCoins.some((coin) => coin.equals(currency)),
    )

    if (zeroFee) return undefined

    return outputAmount.multiply(25).divide(10000)
  }, [inputAmount, outputAmount])

  const feeSavedUsdValue = useStablecoinPriceAmount(inputAmount?.currency, Number(feeSavedAmount?.toExact()), {
    enabled: Boolean(feeSavedAmount),
  })

  return {
    feeSavedAmount,
    feeSavedUsdValue,
  }
}
