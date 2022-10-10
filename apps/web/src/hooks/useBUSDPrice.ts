import { ChainId, Currency, CurrencyAmount, JSBI, Pair, Price, Token, WNATIVE, WBNB } from '@pancakeswap/sdk'
import { FAST_INTERVAL } from 'config/constants'
import { BUSD, CAKE, USDC } from '@pancakeswap/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import useSWR from 'swr'
import getLpAddress from 'utils/getLpAddress'
import { multiplyPriceByAmount } from 'utils/prices'
import { isChainTestnet } from 'utils/wagmi'
import { useProvider } from 'wagmi'
import { usePairContract } from './useContract'
import { PairState, usePairs } from './usePairs'

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price<Currency, Currency> | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = currency?.wrapped
  const wnative = WNATIVE[chainId]
  const stable = BUSD[chainId] || USDC[chainId]

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
      [stable && wrapped?.equals(stable) ? undefined : wrapped, stable],
      [chainId ? wnative : undefined, stable],
    ],
    [wnative, stable, chainId, currency, wrapped],
  )
  const [[bnbPairState, bnbPair], [busdPairState, busdPair], [busdBnbPairState, busdBnbPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId || !wnative) {
      return undefined
    }

    const isBUSDPairExist =
      busdPair &&
      busdPairState === PairState.EXISTS &&
      busdPair.reserve0.greaterThan('0') &&
      busdPair.reserve1.greaterThan('0')

    // handle wbnb/bnb
    if (wrapped.equals(wnative)) {
      if (isBUSDPairExist) {
        const price = busdPair.priceOf(wnative)
        return new Price(currency, stable, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(stable)) {
      return new Price(stable, stable, '1', '1')
    }

    const isBnbPairExist =
      bnbPair &&
      bnbPairState === PairState.EXISTS &&
      bnbPair.reserve0.greaterThan('0') &&
      bnbPair.reserve1.greaterThan('0')
    const isBusdBnbPairExist =
      busdBnbPair &&
      busdBnbPairState === PairState.EXISTS &&
      busdBnbPair.reserve0.greaterThan('0') &&
      busdBnbPair.reserve1.greaterThan('0')

    const bnbPairBNBAmount = isBnbPairExist && bnbPair?.reserveOf(wnative)
    const bnbPairBNBBUSDValue: JSBI =
      bnbPairBNBAmount && isBUSDPairExist && isBusdBnbPairExist
        ? busdBnbPair.priceOf(wnative).quote(bnbPairBNBAmount).quotient
        : JSBI.BigInt(0)

    // all other tokens
    // first try the busd pair
    if (isBUSDPairExist && busdPair.reserveOf(stable).greaterThan(bnbPairBNBBUSDValue)) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, stable, price.denominator, price.numerator)
    }
    if (isBnbPairExist && isBusdBnbPairExist) {
      if (busdBnbPair.reserveOf(stable).greaterThan('0') && bnbPair.reserveOf(wnative).greaterThan('0')) {
        const bnbBusdPrice = busdBnbPair.priceOf(stable)
        const currencyBnbPrice = bnbPair.priceOf(wnative)
        const busdPrice = bnbBusdPrice.multiply(currencyBnbPrice).invert()
        return new Price(currency, stable, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [
    currency,
    wrapped,
    chainId,
    wnative,
    stable,
    bnbPair,
    busdBnbPair,
    busdPairState,
    busdPair,
    bnbPairState,
    busdBnbPairState,
  ])
}

export const usePriceByPairs = (currencyA?: Currency, currencyB?: Currency) => {
  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]
  const pairAddress = getLpAddress(tokenA, tokenB)
  const pairContract = usePairContract(pairAddress)
  const provider = useProvider({ chainId: currencyA.chainId })

  const { data: price } = useSWR(
    currencyA && currencyB && ['pair-price', currencyA, currencyB],
    async () => {
      const reserves = await pairContract.connect(provider).getReserves()
      if (!reserves) {
        return null
      }
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

      const pair = new Pair(
        CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
        CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
      )

      return pair.priceOf(tokenB)
    },
    { dedupingInterval: FAST_INTERVAL, refreshInterval: FAST_INTERVAL },
  )

  return price
}

export const useBUSDCurrencyAmount = (currency?: Currency, amount?: number): number | undefined => {
  const busdPrice = useBUSDPrice(currency)
  if (!amount) {
    return undefined
  }
  if (busdPrice) {
    return multiplyPriceByAmount(busdPrice, amount)
  }
  return undefined
}

export const useBUSDCakeAmount = (amount: number): number | undefined => {
  const cakeBusdPrice = useCakeBusdPrice()
  if (cakeBusdPrice) {
    return multiplyPriceByAmount(cakeBusdPrice, amount)
  }
  return undefined
}

// @Note: only fetch from one pair
export const useCakeBusdPrice = ({ forceMainnet } = { forceMainnet: false }): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  const isTestnet = !forceMainnet && isChainTestnet(chainId)
  // Return bsc testnet cake if chain is testnet
  const cake: Token = isTestnet ? CAKE[ChainId.BSC_TESTNET] : CAKE[ChainId.BSC]
  return usePriceByPairs(BUSD[cake.chainId], cake)
}

// @Note: only fetch from one pair
export const useBNBBusdPrice = ({ forceMainnet } = { forceMainnet: false }): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  const isTestnet = !forceMainnet && isChainTestnet(chainId)
  // Return bsc testnet wbnb if chain is testnet
  const wbnb: Token = isTestnet ? WBNB[ChainId.BSC_TESTNET] : WBNB[ChainId.BSC]
  return usePriceByPairs(BUSD[wbnb.chainId], wbnb)
}
