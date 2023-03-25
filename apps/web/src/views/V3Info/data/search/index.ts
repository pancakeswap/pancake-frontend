import { gql, GraphQLClient } from 'graphql-request'

import { PoolData, TokenData } from '../../types'
import { escapeRegExp, notEmpty } from '../../utils'
import { fetchedTokenDatas } from '../token/tokenData'
import { fetchPoolDatas } from '../pool/poolData'

export const TOKEN_SEARCH = gql`
  query tokens($value: String, $id: String) {
    asSymbol: tokens(
      where: { symbol_contains: $value }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      symbol
      name
      totalValueLockedUSD
    }
    asName: tokens(
      where: { name_contains: $value }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      symbol
      name
      totalValueLockedUSD
    }
    asAddress: tokens(where: { id: $id }, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
      symbol
      name
      totalValueLockedUSD
    }
  }
`

export const POOL_SEARCH = gql`
  query pools($tokens: [Bytes]!, $id: String) {
    as0: pools(where: { token0_in: $tokens }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    as1: pools(where: { token1_in: $tokens }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    asAddress: pools(where: { id: $id }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`

interface TokenRes {
  asSymbol: {
    id: string
    symbol: string
    name: string
    totalValueLockedUSD: string
  }[]
  asName: {
    id: string
    symbol: string
    name: string
    totalValueLockedUSD: string
  }[]
  asAddress: {
    id: string
    symbol: string
    name: string
    totalValueLockedUSD: string
  }[]
}

interface PoolResFields {
  id: string
  feeTier: string
  token0: {
    id: string
    symbol: string
    name: string
  }
  token1: {
    id: string
    symbol: string
    name: string
  }
}

interface PoolRes {
  as0: PoolResFields[]
  as1: PoolResFields[]
  asAddress: PoolResFields[]
}

export async function fetchSearchResults(
  client: GraphQLClient,
  value: string,
): Promise<{
  tokens: TokenData[]
  pools: PoolData[]
}> {
  try {
    const tokens = await client.request<TokenRes>(TOKEN_SEARCH, {
      value: value ? value.toUpperCase() : '',
      id: value,
    })
    const pools = await client.request<PoolRes>(POOL_SEARCH, {
      tokens: tokens.asSymbol?.map((t) => t.id),
      id: value,
    })

    const tokenAddress = [
      ...tokens.asAddress.map((d) => d.id),
      ...tokens.asName.map((d) => d.id),
      ...tokens.asSymbol.map((d) => d.id),
    ]

    const poolAddress = [
      ...pools.as0.map((d) => d.id),
      ...pools.as1.map((d) => d.id),
      ...pools.asAddress.map((d) => d.id),
    ]

    const tokensData = await fetchedTokenDatas(client, tokenAddress, [])
    const poolsData = await fetchPoolDatas(client, poolAddress, [])

    const filteredSortedTokens = Object.values(tokensData.data)
      .filter(notEmpty)
      .filter((t) => {
        const regexMatches = Object.keys(t).map((tokenEntryKey) => {
          const isAddress = value.slice(0, 2) === '0x'
          if (tokenEntryKey === 'address' && isAddress) {
            return t[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
          }
          if (tokenEntryKey === 'symbol' && !isAddress) {
            return t[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
          }
          if (tokenEntryKey === 'name' && !isAddress) {
            return t[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
          }
          return false
        })
        return regexMatches.some((m) => m)
      })

    const filteredSortedPools = Object.values(poolsData.data)
      .filter(notEmpty)
      .filter((t) => {
        const regexMatches = Object.keys(t).map((key) => {
          const isAddress = value.slice(0, 2) === '0x'
          if (key === 'address' && isAddress) {
            return t[key].match(new RegExp(escapeRegExp(value), 'i'))
          }
          if ((key === 'token0' || key === 'token1') && !isAddress) {
            return (
              t[key].name.match(new RegExp(escapeRegExp(value), 'i')) ||
              t[key].symbol.toLocaleLowerCase().match(new RegExp(escapeRegExp(value.toLocaleLowerCase()), 'i'))
            )
          }
          return false
        })
        return regexMatches.some((m) => m)
      })

    return {
      tokens: filteredSortedTokens,
      pools: filteredSortedPools,
    }
  } catch (e) {
    return {
      tokens: [],
      pools: [],
    }
  }
}
