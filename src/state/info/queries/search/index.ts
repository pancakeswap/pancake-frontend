import { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { useTokenDatas, usePoolDatas } from 'state/info/hooks'
import { TokenData, PoolData } from 'state/info/types'
import { MINIMUM_SEARCH_CHARACTERS } from 'config/constants/info'

const TOKEN_SEARCH = gql`
  query tokens($symbol: String, $name: String, $id: String) {
    asSymbol: tokens(first: 10, where: { symbol_contains: $symbol }, orderBy: tradeVolumeUSD, orderDirection: desc) {
      id
    }
    asName: tokens(first: 10, where: { name_contains: $name }, orderBy: tradeVolumeUSD, orderDirection: desc) {
      id
    }
    asAddress: tokens(first: 1, where: { id: $id }, orderBy: tradeVolumeUSD, orderDirection: desc) {
      id
    }
  }
`

const POOL_SEARCH = gql`
  query pools($tokens: [Bytes]!, $id: String) {
    as0: pairs(first: 10, where: { token0_in: $tokens }) {
      id
    }
    as1: pairs(first: 10, where: { token1_in: $tokens }) {
      id
    }
    asAddress: pairs(first: 1, where: { id: $id }) {
      id
    }
  }
`

interface SingleQueryResponse {
  id: string[]
}

interface TokenSearchResponse {
  asSymbol: SingleQueryResponse[]
  asName: SingleQueryResponse[]
  asAddress: SingleQueryResponse[]
}
interface PoolSearchResponse {
  as0: SingleQueryResponse[]
  as1: SingleQueryResponse[]
  asAddress: SingleQueryResponse[]
}

const getIds = (entityArrays: SingleQueryResponse[][]) => {
  const ids = entityArrays
    .reduce((entities, currentTokenArray) => [...entities, ...currentTokenArray], [])
    .map((entity) => entity.id)
  return Array.from(new Set(ids))
}

const useFetchSearchResults = (
  searchString: string,
): {
  tokens: TokenData[]
  pools: PoolData[]
  tokensLoading: boolean
  poolsLoading: boolean
  error: boolean
} => {
  const [searchResults, setSearchResults] = useState({
    tokens: [], // Token ids found by search query
    pools: [], // Pool ids found by search query
    loading: false, // Search query is in progress
    error: false, // GraphQL returned error
  })

  const searchStringTooShort = searchString.length < MINIMUM_SEARCH_CHARACTERS

  // New value received, reset state
  useEffect(() => {
    setSearchResults({
      tokens: [],
      pools: [],
      loading: !searchStringTooShort,
      error: false,
    })
  }, [searchString, searchStringTooShort])

  useEffect(() => {
    const search = async () => {
      try {
        const tokens = await request<TokenSearchResponse>(INFO_CLIENT, TOKEN_SEARCH, {
          symbol: searchString.toUpperCase(),
          // Most well known tokens have first letter capitalized
          name: searchString.charAt(0).toUpperCase() + searchString.slice(1),
          id: searchString.toLowerCase(),
        })
        const tokenIds = getIds([tokens.asAddress, tokens.asSymbol, tokens.asName])
        const pools = await request<PoolSearchResponse>(INFO_CLIENT, POOL_SEARCH, {
          tokens: tokenIds,
          id: searchString.toLowerCase(),
        })
        setSearchResults({
          tokens: tokenIds,
          pools: getIds([pools.asAddress, pools.as0, pools.as1]),
          loading: false,
          error: false,
        })
      } catch (error) {
        console.error(`Search failed for ${searchString}`, error)
        setSearchResults({
          tokens: [],
          pools: [],
          loading: false,
          error: true,
        })
      }
    }
    if (!searchStringTooShort) {
      search()
    }
  }, [searchString, searchStringTooShort])

  // Save ids to Redux
  // Token and Pool updater will then go fetch full data for these addresses
  // These hooks in turn will return data of tokens that have been fetched
  const tokenDatasFull = useTokenDatas(searchResults.tokens)
  const poolDatasFull = usePoolDatas(searchResults.pools)

  // If above hooks returned not all tokens/pools it means
  // that some requests for full data are in progress
  const tokensLoading = tokenDatasFull.length !== searchResults.tokens.length || searchResults.loading
  const poolsLoading = poolDatasFull.length !== searchResults.pools.length || searchResults.loading

  return {
    tokens: tokenDatasFull,
    pools: poolDatasFull,
    tokensLoading,
    poolsLoading,
    error: searchResults.error,
  }
}

export default useFetchSearchResults
