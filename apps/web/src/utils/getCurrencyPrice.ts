import { Currency } from '@pancakeswap/sdk'

const PRICE_API = 'https://alpha.wallet-api.pancakeswap.com/v1/prices/list/'

function getCurrencyKey(currency?: Currency): string | undefined {
  if (!currency) {
    return undefined
  }
  const { chainId } = currency
  return `${chainId}:${currency.wrapped.address.toLowerCase()}`
}

function getRequestUrl(currency?: Currency): string | undefined {
  if (!currency) {
    return undefined
  }
  const currencyKey = getCurrencyKey(currency)
  if (!currencyKey) {
    return undefined
  }
  const encodedKey = encodeURIComponent(currencyKey)
  return `${PRICE_API}${encodedKey}`
}

export async function getCurrencyPrice(currency: Currency | undefined) {
  const currencyKey = getCurrencyKey(currency)
  const requestUrl = getRequestUrl(currency)

  if (!requestUrl || !currencyKey) {
    throw new Error(`Invalid request for currency price, currency key: ${currencyKey}`)
  }
  const res = await fetch(requestUrl)
  const data = await res.json()
  return data[currencyKey] || 0
}
