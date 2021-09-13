import { request, gql } from 'graphql-request'
import { GRAPH_API_NFTMARKET, API_NFT } from 'config/constants/endpoints'

export const getCollectionsApi = async () => {
  const res = await fetch(`${API_NFT}/collections`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }
  return []
}

export const getCollectionsSg = async (): Promise<any[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        {
          collections {
            id
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

export const getNftsMetadata = async (collectionAddress: string) => {
  // @TODO Replace by the API
  return Promise.resolve([])
}

interface NftsFromSubgraph {
  tokenId: string
  currentSeller: string
  isTradable: boolean
  metadataUrl: string
}
export const getNftsMarketData = async (collectionAddress: string): Promise<NftsFromSubgraph[]> => {
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
