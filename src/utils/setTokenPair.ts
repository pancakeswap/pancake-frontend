import { Token } from '@pancakeswap/sdk'
import { currencyId } from './currencyId'

// set inputCurrency to url parameter
// Except for bnb, the other tokens will be address.
export const setInputCurrencyToUrlParameter = (currencyInput: Token) => {
  const url = new URL(window.location.href)
  url.searchParams.set('inputCurrency', currencyId(currencyInput))
  window.history.replaceState({}, null, url)
}

// set outputCurrency to url parameter
// Except for bnb, the other tokens will be address.
export const setOutputCurrencyToUrlParameter = (currencyOutput: Token) => {
  const url = new URL(window.location.href)
  url.searchParams.set('outputCurrency', currencyId(currencyOutput))
  window.history.replaceState({}, null, url)
}
