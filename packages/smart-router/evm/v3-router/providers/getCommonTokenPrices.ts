import { ChainId, getLlamaChainName } from '@pancakeswap/chains'
import { Currency, Token } from '@pancakeswap/sdk'
import { gql } from 'graphql-request'
import { Address, getAddress } from 'viem'

import { withFallback } from '../../utils/withFallback'
import { getCheckAgainstBaseTokens } from '../functions'
import { SubgraphProvider } from '../types'

const tokenPriceQuery = gql`
  query getTokens($pageSize: Int!, $tokenAddrs: [ID!]) {
    tokens(first: $pageSize, where: { id_in: $tokenAddrs }) {
      id
      derivedUSD
    }
  }
`

export type GetCommonTokenPricesParams = {
  currencyA?: Currency
  currencyB?: Currency
}

interface BySubgraphEssentials {
  // V3 subgraph provider
  provider?: SubgraphProvider
}

type ParamsWithFallback = GetCommonTokenPricesParams & {
  v3SubgraphProvider?: SubgraphProvider
}

export type TokenUsdPrice = {
  address: string
  priceUSD: string
}

export type GetTokenPrices<T> = (params: { addresses: string[]; chainId?: ChainId } & T) => Promise<TokenUsdPrice[]>

export type CommonTokenPriceProvider<T> = (
  params: GetCommonTokenPricesParams & T,
) => Promise<Map<Address, number> | null>

export function createCommonTokenPriceProvider<T = any>(
  getTokenPrices: GetTokenPrices<T>,
): CommonTokenPriceProvider<T> {
  return async function getCommonTokenPrices({ currencyA, currencyB, ...rest }: GetCommonTokenPricesParams & T) {
    const baseTokens: Token[] = await getCheckAgainstBaseTokens(currencyA, currencyB)
    if (!baseTokens) {
      return null
    }
    const map = new Map<Address, number>()
    const idToToken: { [key: string]: Currency } = {}
    const addresses = baseTokens.map((t) => {
      const address = getAddress(t.address)
      idToToken[address] = t
      return address
    })
    const tokenPrices = await getTokenPrices({ addresses, chainId: currencyA?.chainId, ...(rest as T) })
    for (const { address, priceUSD } of tokenPrices) {
      const token = idToToken[getAddress(address)]
      if (token) {
        map.set(token.wrapped.address, parseFloat(priceUSD) || 0)
      }
    }

    return map
  }
}

export const getTokenUsdPricesBySubgraph: GetTokenPrices<BySubgraphEssentials> = async ({
  addresses,
  chainId,
  provider,
}) => {
  const client = provider?.({ chainId })
  if (!client) {
    throw new Error('No valid subgraph data provider')
  }
  const { tokens: tokenPrices } = await client.request<{ tokens: { id: string; derivedUSD: string }[] }>(
    tokenPriceQuery,
    {
      pageSize: 1000,
      tokenAddrs: addresses.map((addr) => addr.toLocaleLowerCase()),
    },
  )
  return tokenPrices.map(({ id, derivedUSD }) => ({
    address: id,
    priceUSD: derivedUSD,
  }))
}

export const getCommonTokenPricesBySubgraph =
  createCommonTokenPriceProvider<BySubgraphEssentials>(getTokenUsdPricesBySubgraph)

type LlamaTokenPriceFetcherFactoryOptions = {
  endpoint: string
}

const createGetTokenPriceFromLlmaWithCache = ({
  endpoint,
}: LlamaTokenPriceFetcherFactoryOptions): GetTokenPrices<BySubgraphEssentials> => {
  // Add cache in case we reach the rate limit of llma api
  const cache = new Map<string, TokenUsdPrice>()

  return async ({ addresses, chainId }) => {
    if (!chainId || !getLlamaChainName(chainId)) {
      return []
    }
    const [cachedResults, addressesToFetch] = addresses.reduce<[TokenUsdPrice[], string[]]>(
      ([cachedAddrs, newAddrs], address) => {
        const cached = cache.get(address)
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
      .map((address) => `${getLlamaChainName(chainId)}:${address.toLocaleLowerCase()}`)
      .join(',')
    const result: { coins?: { [key: string]: { price: string } } } = await fetch(`${endpoint}/${list}`).then((res) =>
      res.json(),
    )

    const { coins = {} } = result
    return [
      ...cachedResults,
      ...Object.entries(coins).map(([key, value]) => {
        const [, address] = key.split(':')
        const tokenPrice = { address, priceUSD: value.price }
        cache.set(getAddress(address), tokenPrice)
        return tokenPrice
      }),
    ]
  }
}

export const getCommonTokenPricesByLlma = createCommonTokenPriceProvider<BySubgraphEssentials>(
  createGetTokenPriceFromLlmaWithCache({
    endpoint: 'https://coins.llama.fi/prices/current',
  }),
)

export const getCommonTokenPricesByWalletApi = createCommonTokenPriceProvider<BySubgraphEssentials>(
  createGetTokenPriceFromLlmaWithCache({
    endpoint: 'https://wallet-api.pancakeswap.com/v1/prices',
  }),
)

export const getCommonTokenPrices = withFallback([
  {
    asyncFn: ({ currencyA, currencyB }: ParamsWithFallback) => getCommonTokenPricesByLlma({ currencyA, currencyB }),
    timeout: 3000,
  },
  {
    asyncFn: ({ currencyA, currencyB }: ParamsWithFallback) =>
      getCommonTokenPricesByWalletApi({ currencyA, currencyB }),
    timeout: 3000,
  },
  {
    asyncFn: ({ currencyA, currencyB, v3SubgraphProvider }: ParamsWithFallback) =>
      getCommonTokenPricesBySubgraph({ currencyA, currencyB, provider: v3SubgraphProvider }),
  },
])
