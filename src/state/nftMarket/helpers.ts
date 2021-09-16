import { request, gql } from 'graphql-request'
import { GRAPH_API_NFTMARKET, API_NFT } from 'config/constants/endpoints'
import { getErc721Contract } from 'utils/contractHelpers'
import { ethers } from 'ethers'
import map from 'lodash/map'
import { NftTokenSg, ApiCollections, TokenIdWithCollectionAddress, NFT, UserActivity } from './types'
import { getBaseNftFields, getBaseTransactionFields } from './queries'

/**
 * Fetch static data from all collections using the API
 * @returns
 */
export const getCollectionsApi = async () => {
  const res = await fetch(`${API_NFT}/collections`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return []
}

/**
 * Fetch market data from all collections using the Subgraph
 * @returns
 */
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

/**
 * Fetch static data for all nfts in a collection using the API
 * @param collectionAddress
 * @returns
 */
export const getNftsFromCollectionApi = async (collectionAddress: string): Promise<any[]> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/tokens`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }
  console.error('Failed to fetch NFTs', res.statusText)
  return []
}

/**
 * Fetch market data for all nfts in a collection using the Subgraph
 * @param collectionAddress
 * @returns
 */
export const getNftsFromCollectionSg = async (collectionAddress: string): Promise<NftTokenSg[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftCollectionMarketData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            id
            NFTs {
             ${getBaseNftFields()}
            }
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase() },
    )
    return res.collection.NFTs
  } catch (error) {
    console.error('Failed to fetch NFTs from collection', error)
    return []
  }
}

/**
 * Fetch NFT metadata with a given collection and tokenId using the API
 * @param collectionAddress
 * @param tokenId
 * @returns
 */
export const getNftMetadataFromTokenIdApi = async (collectionAddress: string, tokenId: string): Promise<NFT> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/tokens/${tokenId}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }
  console.error('Failed to fetch token', res.statusText)
  return null
}

/**
 * Fetch NFT metadata for an array of tokenIds and collection addresses
 * @param tokens TokenIdWithCollectionAddress[]
 * @returns
 */
export const getMultipleNftsMetadataFromApi = async (tokens: TokenIdWithCollectionAddress[]) => {
  const metaDataPromises = tokens.map((token) => {
    return getNftMetadataFromTokenIdApi(token.collectionAddress, token.tokenId)
  })
  const nftMetaData = await Promise.all(metaDataPromises)
  return nftMetaData
}

export const getNftsMarketData = async (where = {}): Promise<NftTokenSg[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftsMarketData($where: NFT_filter) {
          nfts(where: $where) {
            ${getBaseNftFields()}
            transactionHistory {
              ${getBaseTransactionFields()}
            }
          }
        }
      `,
      { where },
    )

    return res.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs market data', error)
    return []
  }
}

/**
 * Fetch user trading data for buyTradeHistory, sellTradeHistory and askOrderHistory from the Subgraph
 * @param where a User_filter where condition
 * @returns a UserActivity object
 */
export const getUserActivity = async (where = {}): Promise<UserActivity> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getUserActivity($where: User_filter) {
          users(where: $where) {
            buyTradeHistory(orderBy: timestamp) {
              ${getBaseTransactionFields()}
              NFT {
                ${getBaseNftFields()}
              }
            }
            sellTradeHistory(orderBy: timestamp) {
              ${getBaseTransactionFields()}
              NFT {
                ${getBaseNftFields()}
              }
            }
            askOrderHistory(orderBy: timestamp) {
              id
              block
              timestamp
              orderType
              askPrice
              NFT {
                ${getBaseNftFields()}
              }
            }
          }
        }
      `,
      { where },
    )

    return res.users[0] || { askOrderHistory: [], buyTradeHistory: [], sellTradeHistory: [] }
  } catch (error) {
    console.error('Failed to fetch user Activity', error)
    return {
      askOrderHistory: [],
      buyTradeHistory: [],
      sellTradeHistory: [],
    }
  }
}

export const fetchWalletTokenIdsForCollections = async (
  account: string,
  collections: ApiCollections,
): Promise<TokenIdWithCollectionAddress[]> => {
  const walletNftPromises = map(collections, async (collection): Promise<TokenIdWithCollectionAddress[]> => {
    const { address: collectionAddress } = collection
    const contract = getErc721Contract(collectionAddress)
    const balanceOfResponse = await contract.balanceOf(account)
    const balanceOf = balanceOfResponse.toNumber()

    // User has no NFTs for this collection
    if (balanceOfResponse.eq(0)) {
      return []
    }

    const getTokenId = async (index: number) => {
      try {
        const tokenIdBn: ethers.BigNumber = await contract.tokenOfOwnerByIndex(account, index)
        const tokenId = tokenIdBn.toString()
        return tokenId
      } catch (error) {
        console.error('getTokenIdAndData', error)
        return null
      }
    }

    const tokenIdPromises = []

    // For each index get the tokenId
    for (let i = 0; i < balanceOf; i++) {
      tokenIdPromises.push(getTokenId(i))
    }

    const tokenIds = await Promise.all(tokenIdPromises)
    const tokensWithCollectionAddress = tokenIds.map((tokenId) => {
      return { tokenId, collectionAddress }
    })

    return tokensWithCollectionAddress
  })

  const walletNfts = await Promise.all(walletNftPromises)
  return walletNfts.flat()
}

/**
 * Get the most recently listed NFTs
 * @param first Number of nfts to retrieve
 * @returns NftTokenSg[]
 */
export const getLatestListedNfts = async (first: number): Promise<NftTokenSg[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getLatestNftMarketData($first: Int) {
          nfts(orderBy: updatedAt , orderDirection: desc, first: $first) {
            ${getBaseNftFields()}
            collection {
              id
            }
          }
        }
      `,
      { first },
    )

    return res.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs market data', error)
    return []
  }
}

/**
 * Fetch a NFT using the API
 * /!\ THIS FUNCTION WILL BE REPLACED BY AN ENDPOINT ALLOWING TO FETCH MULTIPLE NFTS /!\
 * @param collectionAddress
 * @param tokenId
 * @returns NFT from API
 */
const getNftApi = async (collectionAddress: string, tokenId: string) => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/tokens/${tokenId}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }

  console.error("Can't fetch NFT API", res.status)
  return {}
}

/**
 * Fetch a list of NFT from different collections
 * @param from Array of { collectionAddress: string; tokenId: string }
 * @returns Array of NFT from API
 */
export const getNftsFromDifferentCollectionsApi = async (
  from: { collectionAddress: string; tokenId: string }[],
): Promise<NFT[]> => {
  const promises = from.map((nft) => getNftApi(nft.collectionAddress, nft.tokenId))
  const responses = await Promise.all(promises)
  return responses.map((res) => ({
    tokenId: res.tokenId,
    id: res.id,
    name: res.name,
    collectionName: null,
    description: res.description,
    image: {
      original: res.image?.original,
      thumbnail: res.image?.thumbnail,
    },
  }))
}
