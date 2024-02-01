import { v3Clients } from 'utils/graphql'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { gql, GraphQLClient } from 'graphql-request'
import { useQuery } from '@tanstack/react-query'

interface TokenPrice {
  id: string
  derivedUSD: string
}

const GET_TOKEN_PRICE_QUERY = (token0Address: string, token1Address: string) => gql`
  {
    tokens(
      where: { id_in: ["${token0Address}", "${token1Address}"] }
    ) {
      id
      derivedUSD
    }
  }
`
const fetchTokenPrice = async (dataClient: GraphQLClient, token0Address: string, token1Address: string) => {
  try {
    const data = await dataClient.request<{ tokens: TokenPrice[] }>(GET_TOKEN_PRICE_QUERY(token0Address, token1Address))
    return data
  } catch (e) {
    console.error(e)
  }
  return null
}

export const useTokenPriceFromSubgraph = (token0Address: string | undefined, token1Address: string | undefined) => {
  const { chainId } = useActiveChainId()
  const { data } = useQuery({
    queryKey: [`positonManager${token0Address ?? ''}-${token1Address}`, chainId],
    queryFn: () => fetchTokenPrice(v3Clients[chainId ?? -1], token0Address ?? '', token1Address ?? ''),
    enabled: Boolean(chainId && token0Address && token1Address),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 3,
    retryDelay: 3000,
  })
  return {
    token0: data?.tokens?.[0]?.derivedUSD ? Number(data.tokens[0].derivedUSD) : 0,
    token1: data?.tokens?.[1]?.derivedUSD ? Number(data.tokens[1].derivedUSD) : 0,
  }
}
