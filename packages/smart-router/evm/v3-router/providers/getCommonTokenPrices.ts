import { ChainId, Currency, Token } from '@pancakeswap/sdk'
import { gql } from 'graphql-request'

import { getCheckAgainstBaseTokens } from '../functions'
import { SubgraphProvider } from '../types'
import { CHAIN_ID_TO_CHAIN_NAME } from '../../constants'
import { withFallback } from '../../utils/withFallback'

const tokenPriceQuery = gql`
  query getTokens($pageSize: Int!, $tokenAddrs: [ID!]) {
    tokens(first: $pageSize, where: { id_in: $tokenAddrs }) {
      id
      derivedUSD
    }
  }
`

interface Params {
  currencyA?: Currency
  currencyB?: Currency
}

interface BySubgraphEssentials {
  // V3 subgraph provider
  provider?: SubgraphProvider
}

interface ParamsWithFallback extends Params {
  v3SubgraphProvider?: SubgraphProvider
}

interface TokenPrice {
  address: string
  priceUSD: string
}

type GetTokenPrices<T> = (params: { addresses: string[]; chainId?: ChainId } & T) => Promise<TokenPrice[]>

function commonTokenPriceProvider<T>(getTokenPrices: GetTokenPrices<T>) {
  return async function getCommonTokenPrices({ currencyA, currencyB, ...rest }: Params & T) {
    const baseTokens: Token[] = getCheckAgainstBaseTokens(currencyA, currencyB)
    if (!baseTokens) {
      return null
    }
    const map = new Map<string, number>()
    const idToToken: { [key: string]: Currency } = {}
    const addresses = baseTokens.map((t) => {
      const address = t.address.toLocaleLowerCase()
      idToToken[address] = t
      return address
    })
    const tokenPrices = await getTokenPrices({ addresses, chainId: currencyA?.chainId, ...(rest as T) })
    for (const { address, priceUSD } of tokenPrices) {
      const token = idToToken[address]
      if (token) {
        map.set(token.wrapped.address, parseFloat(priceUSD) || 0)
      }
    }

    return map
  }
}

export const getCommonTokenPricesBySubgraph = commonTokenPriceProvider<BySubgraphEssentials>(
  async ({ addresses, chainId, provider }) => {
    const client = provider?.({ chainId })
    if (!client) {
      throw new Error('No valid subgraph data provider')
    }
    const { tokens: tokenPrices } = await client.request<{ tokens: { id: string; derivedUSD: string }[] }>(
      tokenPriceQuery,
      {
        pageSize: 1000,
        tokenAddrs: addresses,
      },
    )
    return tokenPrices.map(({ id, derivedUSD }) => ({
      address: id,
      priceUSD: derivedUSD,
    }))
  },
)

const createGetTokenPriceFromLlmaWithCache = (): GetTokenPrices<BySubgraphEssentials> => {
  // Add cache in case we reach the rate limit of llma api
  const cache = new Map<string, TokenPrice>()

  return async ({ addresses, chainId }) => {
    if (!chainId || !CHAIN_ID_TO_CHAIN_NAME[chainId as keyof typeof CHAIN_ID_TO_CHAIN_NAME]) {
      throw new Error(`Invalid chain id ${chainId}`)
    }
    const [cachedResults, addressesToFetch] = addresses.reduce<[TokenPrice[], string[]]>(
      ([cachedAddrs, newAddrs], address) => {
        const cached = cache.get(address.toLocaleLowerCase())
        if (!cached) {
          newAddrs.push(address)
        } else {
          cachedAddrs.push(cached)
        }
        return [cachedAddrs, newAddrs]
      },
      [[], []],
    )

    if (!addressesToFetch.length) {
      return cachedResults
    }

    const list = addressesToFetch
      .map((address) => `${CHAIN_ID_TO_CHAIN_NAME[chainId as keyof typeof CHAIN_ID_TO_CHAIN_NAME]}:${address}`)
      .join(',')
    const result: { coins?: { [key: string]: { price: string } } } = await fetch(
      `https://coins.llama.fi/prices/current/${list}`,
    ).then((res) => res.json())

    const { coins = {} } = result
    return [
      ...cachedResults,
      ...Object.entries(coins).map(([key, value]) => {
        const [, address] = key.split(':')
        const tokenPrice = { address, priceUSD: value.price }
        cache.set(address.toLocaleLowerCase(), tokenPrice)
        return tokenPrice
      }),
    ]
  }
}

export const getCommonTokenPricesByLlma = commonTokenPriceProvider<BySubgraphEssentials>(
  createGetTokenPriceFromLlmaWithCache(),
)

export const getCommonTokenPrices = withFallback([
  {
    asyncFn: ({ currencyA, currencyB, v3SubgraphProvider }: ParamsWithFallback) =>
      getCommonTokenPricesBySubgraph({ currencyA, currencyB, provider: v3SubgraphProvider }),
    timeout: 3000,
  },
  {
    asyncFn: ({ currencyA, currencyB }: ParamsWithFallback) => getCommonTokenPricesByLlma({ currencyA, currencyB }),
  },
])
