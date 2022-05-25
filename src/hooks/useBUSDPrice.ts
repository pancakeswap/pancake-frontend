import { ChainId, Currency, CurrencyAmount, currencyEquals, JSBI, Price } from 'peronio-sdk'
import tokens, { mainnetTokens } from 'config/constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { dividePriceByAmount, multiplyPriceByAmount } from 'utils/prices'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { PairState, usePairs } from './usePairs'
import useARSPrice from './useARSPrice'

const USDC_MAINNET = mainnetTokens.usdc
const { wbnb: WMATIC } = tokens

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useBUSDPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && currencyEquals(WMATIC, wrapped) ? undefined : currency, chainId ? WMATIC : undefined],
      [wrapped?.equals(USDC_MAINNET) ? undefined : wrapped, chainId === ChainId.MAINNET ? USDC_MAINNET : undefined],
      [chainId ? WMATIC : undefined, chainId === ChainId.MAINNET ? USDC_MAINNET : undefined],
    ],
    [chainId, currency, wrapped],
  )
  const [[ethPairState, ethPair], [busdPairState, busdPair], [busdEthPairState, busdEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(WMATIC)) {
      if (busdPair) {
        const price = busdPair.priceOf(WMATIC)
        return new Price(currency, USDC_MAINNET, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(USDC_MAINNET)) {
      return new Price(USDC_MAINNET, USDC_MAINNET, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WMATIC)
    const ethPairETHBUSDValue: JSBI =
      ethPairETHAmount && busdEthPair ? busdEthPair.priceOf(WMATIC).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the busd pair
    if (
      busdPairState === PairState.EXISTS &&
      busdPair &&
      busdPair.reserveOf(USDC_MAINNET).greaterThan(ethPairETHBUSDValue)
    ) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, USDC_MAINNET, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
      if (busdEthPair.reserveOf(USDC_MAINNET).greaterThan('0') && ethPair.reserveOf(WMATIC).greaterThan('0')) {
        const ethBusdPrice = busdEthPair.priceOf(USDC_MAINNET)
        const currencyEthPrice = ethPair.priceOf(WMATIC)
        const busdPrice = ethBusdPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, USDC_MAINNET, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [chainId, currency, ethPair, ethPairState, busdEthPair, busdEthPairState, busdPair, busdPairState, wrapped])
}

export const useCakeBusdPrice = (): Price | undefined => {
  const cakeBusdPrice = useBUSDPrice(tokens.cake)
  return cakeBusdPrice
}

export const usePePriceUsd = (): Price | undefined => {
  const peBusdPrice = useBUSDPrice(tokens.pe)
  return peBusdPrice
}

export const useBUSDCurrencyAmount = (currency: Currency, amount: number): number | undefined => {
  const { chainId } = useActiveWeb3React()
  const busdPrice = useBUSDPrice(currency)
  const wrapped = wrappedCurrency(currency, chainId)
  if (busdPrice) {
    return multiplyPriceByAmount(busdPrice, amount, wrapped.decimals)
  }
  return undefined
}

export const useBUSDCakeAmount = (amount: number): number | undefined => {
  const cakePrice = useCakeBusdPrice()
  if (cakePrice) {
    return multiplyPriceByAmount(cakePrice, amount, tokens.cake.decimals)
  }
  return undefined
}

export const useBUSDPeAmount = (amount: number): number | undefined => {
  const peBusdPrice = usePePriceUsd()
  if (peBusdPrice) {
    return multiplyPriceByAmount(peBusdPrice, amount)
  }
  return undefined
}

export const usePePriceArs = () => {
  const peBusdPrice = usePePriceUsd() /* PE/USDC Price -> PRICE */
  const ARSPrice = useARSPrice() /* ARS Price -> INT */
  return peBusdPrice && ARSPrice ? dividePriceByAmount(peBusdPrice, 1/ARSPrice) : undefined
}

export const useBNBBusdPrice = (): Price | undefined => {
  const bnbBusdPrice = useBUSDPrice(tokens.wbnb)
  return bnbBusdPrice
}
