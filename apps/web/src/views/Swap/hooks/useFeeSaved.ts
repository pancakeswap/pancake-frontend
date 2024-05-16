import { ChainId, Currency, CurrencyAmount, ERC20Token } from '@pancakeswap/sdk'
import { DAI, USDC, USDT } from '@pancakeswap/tokens'
import { parseNumberToFraction } from '@pancakeswap/utils/formatFractions'
import { BigNumber } from 'bignumber.js'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { useStablecoinPrice } from 'hooks/useStablecoinPrice'
import { useMemo } from 'react'
import { multiplyPriceByAmount } from 'utils/prices'

const MAJOR_DEFINED_STABLE_COINS: {
  [chainId in ChainId]?: Array<ERC20Token | undefined>
} = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], DAI[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  [ChainId.ARBITRUM_ONE]: [USDC[ChainId.ARBITRUM_ONE], DAI[ChainId.ARBITRUM_ONE], USDT[ChainId.ARBITRUM_ONE]],
  [ChainId.POLYGON_ZKEVM]: [USDC[ChainId.POLYGON_ZKEVM], DAI[ChainId.POLYGON_ZKEVM], USDT[ChainId.POLYGON_ZKEVM]],
  [ChainId.BSC]: [USDC[ChainId.BSC], DAI[ChainId.BSC], USDT[ChainId.BSC]],
  [ChainId.BASE]: [USDC[ChainId.BASE], DAI[ChainId.BASE]],
}

export const useFeeSaved = (inputAmount?: CurrencyAmount<Currency>, outputAmount?: CurrencyAmount<Currency>) => {
  const feeSavedAmount = useMemo(() => {
    if (!inputAmount || !outputAmount) return undefined

    const { chainId } = inputAmount.currency

    const majorDefinedStableCoins = MAJOR_DEFINED_STABLE_COINS[chainId as ChainId]
    if (!majorDefinedStableCoins) return undefined

    const zeroFee = [inputAmount.currency, outputAmount.currency].every((currency) =>
      majorDefinedStableCoins.some((coin) => coin?.equals(currency)),
    )

    if (zeroFee) return undefined

    return outputAmount.multiply(25).divide(10000)
  }, [inputAmount, outputAmount])

  const { data: outputCurrencyUSDPrice, isLoading } = useCurrencyUsdPrice(feeSavedAmount?.currency, {
    enabled: Boolean(feeSavedAmount),
  })
  const fallbackPrice = useStablecoinPrice(feeSavedAmount?.currency, {
    enabled: Boolean(feeSavedAmount) && !isLoading && !outputCurrencyUSDPrice,
  })
  const feeSavedUsdValue = useMemo(() => {
    if (!feeSavedAmount) return parseNumberToFraction(0)

    if (!outputCurrencyUSDPrice && !fallbackPrice) return parseNumberToFraction(0)

    if (fallbackPrice)
      return parseNumberToFraction(multiplyPriceByAmount(fallbackPrice, Number(feeSavedAmount.toExact())))

    return parseNumberToFraction(new BigNumber(feeSavedAmount?.toExact()).times(outputCurrencyUSDPrice ?? 0).toNumber())
  }, [feeSavedAmount, fallbackPrice, outputCurrencyUSDPrice])

  return {
    feeSavedAmount,
    feeSavedUsdValue,
  }
}
