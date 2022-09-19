/* eslint-disable no-param-reassign */
// import { isTradeBetter } from 'utils/trades'
// import { formatUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import { mainnetTokens } from 'config/constants/tokens'
import { Currency, CurrencyAmount, Mint, Percent, Price, TokenAmount } from 'peronio-sdk'
import JSBI from 'jsbi'
import { useEffect, useMemo, useState } from 'react'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { usePeronioContract } from './useContract'

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

/**
 * Hook for Minting exact IN
 * @param currencyAmountIn
 * @param currencyOut
 * @returns
 */
export function useMintExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Mint | null {
  const peronioContract = usePeronioContract()
  const DECIMALS = mainnetTokens.pe.decimals

  const [markup, setMarkup] = useState<Percent>()
  const [out, setOut] = useState<any>()
  // Get Markup
  useEffect(() => {
    async function fetchMarkup() {
      return new Percent(
        (await peronioContract.markupFee()).toString(),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(DECIMALS)),
      )
    }

    fetchMarkup().then(setMarkup)
  }, [peronioContract, DECIMALS])

  // Get Buying Price
  useEffect(() => {
    if (!currencyOut || !currencyAmountIn) {
      return
    }
    async function fetchBuyingPrice(): Promise<BigNumber> {
      const theAmount = parseUnits(currencyAmountIn.toFixed(), currencyAmountIn.currency.decimals)

      const res: BigNumber = await peronioContract.quoteIn(theAmount)

      return theAmount.mul(10 ** DECIMALS).div(res)
    }

    fetchBuyingPrice()
      .then((buyingPrice) => {
        setOut(buyingPrice)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [peronioContract, DECIMALS, currencyOut, currencyAmountIn])

  return useMemo(() => {
    // Needs Price
    if (!out || !markup || !currencyAmountIn) {
      return null
    }
    const currencyAmountOut = new TokenAmount(mainnetTokens.pe, JSBI.BigInt(out))

    // return Mint.exactOut(currencyAmountOut: CurrencyAmount, price: Price, markup: Percent)
    return new Mint(currencyAmountIn, currencyAmountOut, markup)
  }, [out, markup, currencyAmountIn])
}
