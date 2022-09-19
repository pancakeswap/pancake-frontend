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
        (await migratorContract.quote(currencyAmountIn)).toString(),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(DECIMALS)),
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
