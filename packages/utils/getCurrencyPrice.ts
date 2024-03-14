import { ChainId, isTestnetChainId } from '@pancakeswap/chains'

const PRICE_API = 'https://wallet-api.pancakeswap.com/v1/prices/list/'

const zeroAddress = '0x0000000000000000000000000000000000000000' as const

// duck typing for native currency, token, token info
export type CurrencyParams =
  | {
      chainId: ChainId
      address: `0x${string}`
      isNative?: false
    }
  | {
      chainId: ChainId
      isNative: true
    }

export type CurrencyKey = `${number}:${string}`

export type CurrencyUsdResult = Record<CurrencyKey, number>

export function getCurrencyKey(currencyParams?: CurrencyParams): CurrencyKey | undefined {
  if (!currencyParams) {
    return undefined
  }

  if ('isNative' in currencyParams && currencyParams.isNative === true) {
    return `${currencyParams.chainId}:${zeroAddress}`
  }
  const { chainId, address } = currencyParams
  return `${chainId}:${address.toLowerCase()}`
}

export function getCurrencyListKey(currencyListParams?: CurrencyParams[]): string | undefined {
  if (!currencyListParams) {
    return undefined
  }

  const currencyKeys = currencyListParams.map(getCurrencyKey).filter((key): key is CurrencyKey => !!key)

  const uniqueKeys = [...new Set(currencyKeys)]

  return uniqueKeys.join(',')
}

function getRequestUrl(params?: CurrencyParams | CurrencyParams[]): string | undefined {
  if (!params) {
    return undefined
  }
  const infoList = Array.isArray(params) ? params : [params]
  const key = getCurrencyListKey(infoList.filter((c) => !isTestnetChainId(c.chainId)))
  if (!key) {
    return undefined
  }
  const encodedKey = encodeURIComponent(key)
  return `${PRICE_API}${encodedKey}`
}

export async function getCurrencyUsdPrice(currencyParams?: CurrencyParams) {
  if (!currencyParams || isTestnetChainId(currencyParams.chainId)) {
    return 0
  }

  const prices = await getCurrencyListUsdPrice([currencyParams])
  const key = getCurrencyKey(currencyParams)
  return (key && prices[key]) ?? 0
}

export async function getCurrencyListUsdPrice(currencyListParams?: CurrencyParams[]): Promise<CurrencyUsdResult> {
  const requestUrl = getRequestUrl(currencyListParams)
  if (!requestUrl || !currencyListParams) {
    throw new Error(`Invalid request for currency prices, request url: ${requestUrl}`)
  }
  const res = await fetch(requestUrl)
  const data = await res.json()
  return data
}
