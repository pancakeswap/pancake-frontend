/* eslint-disable no-param-reassign */
// import { isTradeBetter } from 'utils/trades'
// import { formatUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import { mainnetTokens } from 'config/constants/tokens'
import { Currency, CurrencyAmount, Mint, Percent, Price } from 'peronio-sdk'
import JSBI from 'jsbi'
import { useEffect, useMemo, useState } from 'react'
import { useMigratorContract } from './useContract'

/**
 * Hook for Minting exact IN
 * @param currencyAmountIn
 * @param currencyOut
 * @returns
 */
export function useMigrateExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Mint | null {
  // MIGRATOR //

  const migratorContract = useMigratorContract()

  const DECIMALS = mainnetTokens.pe.decimals
  const [quote, setQuote] = useState<Percent>()
  const [price, setPrice] = useState<Price>()

  // Get Markup
  useEffect(() => {
    async function fetchQuote() {
      return new Percent(
        (await migratorContract.quote(currencyAmountIn)).toString(), // quote aca?
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(DECIMALS + 2)),
      )
    }

    fetchQuote().then(setQuote)
  }, [currencyAmountIn, migratorContract, DECIMALS])

  // Get Buying Price
  useEffect(() => {
    if (!currencyOut || !currencyAmountIn) {
      return
    }
    async function fetchBuyingPrice(): Promise<BigNumber> {
      return migratorContract.buyingPrice()
    }

    fetchBuyingPrice()
      .then((buyingPrice) => {
        setPrice(
          new Price(
            currencyAmountIn.currency,
            currencyOut,
            buyingPrice.toString(),
            JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(DECIMALS)),
          ),
        )
      })
      .catch((e) => {
        console.error(e)
      })
  }, [migratorContract, DECIMALS, currencyOut, currencyAmountIn])

  return useMemo(() => {
    // Needs Price
    if (!price || !quote || !currencyAmountIn) {
      return null
    }

    // return Mint.exactOut(currencyAmountOut: CurrencyAmount, price: Price, markup: Percent)
    return Mint.exactIn(currencyAmountIn, price, quote)
  }, [price, quote, currencyAmountIn])
}

/**
 * Hook for Minting exact OUT
 * @param currencyAmountOut
 * @param currencyIn
 * @returns
 */
export function useMigrateExactOut(currencyAmountOut?: CurrencyAmount, currencyIn?: Currency): Mint | null {
  const migratorContract = useMigratorContract()
  const DECIMALS = mainnetTokens.pe.decimals

  const [markup, setMarkup] = useState<Percent>()
  const [price, setPrice] = useState<Price>()

  // Get Markup
  useEffect(() => {
    // async function fetchMarkup() {
    //   return new Percent(
    //     (await migratorContract.markup()).toString(),
    //     JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(DECIMALS + 2)),
    //   )
    // }
    // fetchMarkup().then(setMarkup)
  }, [])

  // Get Buying Price
  useEffect(() => {
    // if (!currencyIn || !currencyAmountOut) {
    //   return
    // }
    // async function fetchBuyingPrice(): Promise<BigNumber> {
    //   return migratorContract.buyingPrice()
    // }
    // fetchBuyingPrice()
    //   .then((buyingPrice) => {
    //     setPrice(
    //       new Price(
    //         currencyIn,
    //         currencyAmountOut.currency,
    //         buyingPrice.toString(),
    //         JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(DECIMALS)),
    //       ),
    //     )
    //   })
    //   .catch((e) => {
    //     console.error(e)
    //   })
  }, [])

  return useMemo(() => {
    // Needs Price
    if (!price || !markup || !currencyAmountOut) {
      return null
    }

    // return Mint.exactOut(currencyAmountOut: CurrencyAmount, price: Price, markup: Percent)
    return Mint.exactOut(currencyAmountOut, price, markup)
  }, [price, currencyAmountOut, markup])
}
