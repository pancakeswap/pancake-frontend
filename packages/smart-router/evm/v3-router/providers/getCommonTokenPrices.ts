import { Currency, Token } from '@pancakeswap/sdk'
import { gql } from 'graphql-request'

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

interface Params {
  currencyA?: Currency
  currencyB?: Currency

  // V3 subgraph provider
  provider?: SubgraphProvider
}

export async function getCommonTokenPrices({ currencyA, currencyB, provider }: Params) {
  if (!provider) {
    throw new Error('No valid subgraph data provider')
  }
  const baseTokens: Token[] = getCheckAgainstBaseTokens(currencyA, currencyB)
  const client = provider({ chainId: currencyA?.chainId })
  if (!client || !baseTokens) {
    return null
  }
  const map = new Map<string, number>()
  const idToToken: { [key: string]: Currency } = {}
  const addresses = baseTokens.map((t) => {
    const address = t.address.toLocaleLowerCase()
    idToToken[address] = t
    return address
  })
  const { tokens: tokenPrices } = await client.request<{ tokens: { id: string; derivedUSD: string }[] }>(
    tokenPriceQuery,
    {
      pageSize: 1000,
      tokenAddrs: addresses,
    },
  )
  for (const { id, derivedUSD } of tokenPrices) {
    const token = idToToken[id]
    if (token) {
      map.set(token.wrapped.address, parseFloat(derivedUSD) || 0)
    }
  }

  return map
}
