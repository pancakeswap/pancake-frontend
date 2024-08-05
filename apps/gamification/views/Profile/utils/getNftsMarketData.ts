import { GRAPH_API_NFTMARKET } from 'config/constants/endpoints'
import { gql, request } from 'graphql-request'
import { baseNftFields, baseTransactionFields } from 'views/ProfileCreation/Nft/queries'
import { TokenMarketData } from 'views/ProfileCreation/Nft/type'

export const getNftsMarketData = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftsMarketData($first: Int, $skip: Int!, $where: NFT_filter, $orderBy: NFT_orderBy, $orderDirection: OrderDirection) {
          nfts(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${baseNftFields}
            transactionHistory {
              ${baseTransactionFields}
            }
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )

    return res.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs market data', error)
    return []
  }
}
