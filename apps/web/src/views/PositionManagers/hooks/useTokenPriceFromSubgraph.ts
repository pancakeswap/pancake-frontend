import { v3Clients } from 'utils/graphql'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { gql, GraphQLClient } from 'graphql-request'
import useSWRImmutable from 'swr/immutable'

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
  const { data } = useSWRImmutable(
    !!chainId && token0Address && token1Address && [`positonManager${token0Address ?? ''}-${token1Address}`, chainId],
    () => fetchTokenPrice(v3Clients[chainId ?? -1], token0Address ?? '', token1Address ?? ''),
    { errorRetryCount: 3, errorRetryInterval: 3000 },
  )
  return {
    token0: data?.tokens?.[0]?.derivedUSD ? Number(data.tokens[0].derivedUSD) : 0,
    token1: data?.tokens?.[1]?.derivedUSD ? Number(data.tokens[1].derivedUSD) : 0,
  }
}
