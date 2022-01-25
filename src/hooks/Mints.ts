/* eslint-disable no-param-reassign */
// import { isTradeBetter } from 'utils/trades'
import { formatUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import { mainnetTokens } from 'config/constants/tokens'
import { Currency, CurrencyAmount, Mint, TokenAmount } from 'peronio-sdk'
import JSBI from 'jsbi'
import { useEffect, useMemo, useState } from 'react'
import { usePeronioContract } from './useContract'

// import useActiveWeb3React from 'hooks/useActiveWeb3React'

// import { useUserSingleHopOnly } from 'state/user/hooks'
// import { BETTER_TRADE_LESS_HOPS_THRESHOLD } from '../config/constants'
// import { wrappedCurrency } from '../utils/wrappedCurrency'

// import { useUnsupportedTokens } from './Tokens'

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useMintExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Mint | null {
  const peronioContract = usePeronioContract()
  const DECIMALS = mainnetTokens.pe.decimals

  const [markup, setMarkup] = useState<string>()
  const [buyingPrice, setBuyingPrice] = useState<BigNumber>()

  // Get Markup Decimals
  useEffect(() => {
    async function fetchMarkup() {
      const markupDecimals = await peronioContract.markup_decimals()
      return formatUnits(await peronioContract.markup(), markupDecimals)
    }

    fetchMarkup().then(setMarkup)
  }, [peronioContract])

  // Get Buying Price
  useEffect(() => {
    if (!markup) {
      return
    }
    async function fetchBuyingPrice() {
      return peronioContract.buyingPrice()
    }

    fetchBuyingPrice().then(setBuyingPrice)
  }, [peronioContract, markup, DECIMALS])

  return useMemo(() => {
    // Needs Buying Price and currency
    if (!buyingPrice || !currencyAmountIn) {
      return null
    }
    // Add extra decimals
    const amountOutWithDecimals = JSBI.multiply(
      currencyAmountIn.raw,
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(DECIMALS)),
    )
    const amountOut = JSBI.divide(amountOutWithDecimals, JSBI.BigInt(buyingPrice.toString()))

    const fee = parseInt(markup)
    const currencyAmountOut = new TokenAmount(mainnetTokens.pe, amountOut)

    return new Mint(currencyAmountIn, currencyAmountOut, fee)
  }, [markup, buyingPrice, currencyAmountIn, DECIMALS])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
// export function useMintExactOut(currencyIn?: Currency, currencyAmountOut?: CurrencyAmount): Mint | null {
//   return useMemo(() => {
//     if (currencyIn && currencyAmountOut) {
//       return Mint.exactOut(currencyAmountOut)
//     }

//     return null
//   }, [currencyAmountOut, currencyIn])
// }
