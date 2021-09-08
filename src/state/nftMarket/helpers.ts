import { request, gql } from 'graphql-request'
import { GRAPH_API_NFTMARKET } from 'config/constants/endpoints'

export const getCollections = async (): Promise<any[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        {
          collections {
            id
            name
            symbol
            active
            totalVolumeBNB
            numberTokensListed
            tradingFee
            creatorFee
          }
        }
      `,
    )
    return res.collections
  } catch (error) {
    console.error('Failed to fetch NFT collections', error)
    return []
  }
}

export const getNftsFromCollection = async (collectionAddress: string): Promise<any[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftsFromCollection($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            id
            NFTs {
              currentSeller
              isTradable
              tokenId
              metadataUrl
            }
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase() },
    )
    return res.collection.NFTs
  } catch (error) {
    console.error('Failed to fetch NFTs', error)
    return []
  }
}
