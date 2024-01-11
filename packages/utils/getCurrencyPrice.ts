import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/swap-sdk-core'

const PRICE_API = 'https://alpha.wallet-api.pancakeswap.com/v1/prices/list/'

export type TokenInfo = {
  chainId: ChainId
  address: string
}

function getTokenInfoKey(info?: TokenInfo) {
  if (!info) {
    return undefined
  }
  const { chainId, address } = info
  return `${chainId}:${address.toLowerCase()}`
}

function getTokenInfoListKey(infoList?: TokenInfo[]): string | undefined {
  if (!infoList) {
    return undefined
  }
  return infoList
    .map(getTokenInfoKey)
    .filter((key): key is string => !!key)
    .join(',')
}

function getCurrencyKey(currency?: Currency): string | undefined {
  if (!currency) {
    return undefined
  }
  const { chainId } = currency
  return getTokenInfoKey({
    chainId,
    address: currency.wrapped.address,
  })
}

function getCurrencyListKey(currencies?: Currency[]): string | undefined {
  if (!currencies) {
    return undefined
  }
  return currencies
    .map(getCurrencyKey)
    .filter((key): key is string => !!key)
    .join(',')
}

function getRequestUrl(currencies?: Currency | Currency[]): string | undefined {
  if (!currencies) {
    return undefined
  }
  const currencyList = Array.isArray(currencies) ? currencies : [currencies]
  const key = getCurrencyListKey(currencyList)
  if (!key) {
    return undefined
  }
  const encodedKey = encodeURIComponent(key)
  return `${PRICE_API}${encodedKey}`
}

function getRequestUrlByInfo(info?: TokenInfo | TokenInfo[]): string | undefined {
  if (!info) {
    return undefined
  }
  const infoList = Array.isArray(info) ? info : [info]
  const key = getTokenInfoListKey(infoList)
  if (!key) {
    return undefined
  }
  const encodedKey = encodeURIComponent(key)
  return `${PRICE_API}${encodedKey}`
}

export async function getCurrencyPrice(currency?: Currency) {
  const prices = getCurrencyPrices(currency && [currency])
  return (currency && prices[currency.wrapped.address]) ?? 0
}

export async function getCurrencyPrices(currencies?: Currency[]): Promise<{ [address: string]: number }> {
  const requestUrl = getRequestUrl(currencies)

  if (!requestUrl || !currencies) {
    throw new Error(`Invalid request for currency prices, request url: ${requestUrl}`)
  }
  const res = await fetch(requestUrl)
  const data = await res.json()
  const result: { [address: string]: number } = {}
  for (const currency of currencies) {
    const key = getCurrencyKey(currency)
    result[currency.wrapped.address] = (key && data[key]) ?? 0
  }
  return result
}

export async function getTokenUsdPrice(tokenInfo?: TokenInfo) {
  const prices = await getCurrencyPricesByTokenInfoList(tokenInfo && [tokenInfo])
  return (tokenInfo && prices[tokenInfo.address]) ?? 0
}

export async function getCurrencyPricesByTokenInfoList(infoList?: TokenInfo[]): Promise<{ [address: string]: number }> {
  const requestUrl = getRequestUrlByInfo(infoList)
  if (!requestUrl || !infoList) {
    throw new Error(`Invalid request for currency prices, request url: ${requestUrl}`)
  }
  const res = await fetch(requestUrl)
  const data = await res.json()
  const result: { [address: string]: number } = {}
  for (const tokenInfo of infoList) {
    const key = getTokenInfoKey(tokenInfo)
    result[tokenInfo.address] = (key && data[key]) ?? 0
  }
  return result
}
