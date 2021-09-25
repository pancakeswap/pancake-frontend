import { request, gql } from 'graphql-request'
import { GRAPH_API_NFTMARKET, API_NFT } from 'config/constants/endpoints'
import { getErc721Contract } from 'utils/contractHelpers'
import { ethers } from 'ethers'
import map from 'lodash/map'
import {
  TokenMarketData,
  ApiCollections,
  TokenIdWithCollectionAddress,
  NftToken,
  NftLocation,
  Collection,
  ApiResponseCollectionTokens,
  ApiResponseSpecificToken,
  ApiCollection,
  CollectionMarketDataBaseFields,
  Transaction,
  AskOrder,
} from './types'
import { getBaseNftFields, getBaseTransactionFields, getCollectionBaseFields } from './queries'

/**
 * API HELPERS
 */

/**
 * Fetch static data from all collections using the API
 * @returns
 */
export const getCollectionsApi = async (): Promise<ApiCollection[]> => {
  const res = await fetch(`${API_NFT}/collections`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return []
}

/**
 * Fetch static data from a collection using the API
 * @returns
 */
export const getCollectionApi = async (collectionAddress: string): Promise<ApiCollection> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }
  console.error(`API: Failed to fetch NFT collection ${collectionAddress}`, res.statusText)
  return null
}

/**
 * Fetch static data for all nfts in a collection using the API
 * @param collectionAddress
 * @returns
 */
export const getNftsFromCollectionApi = async (collectionAddress: string): Promise<ApiResponseCollectionTokens> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/tokens`)
  if (res.ok) {
    const data = await res.json()
    return data
  }
  console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, res.statusText)
  return null
}

/**
 * Fetch a NFT using the API
 * /!\ THIS FUNCTION WILL BE REPLACED BY AN ENDPOINT ALLOWING TO FETCH MULTIPLE NFTS /!\
 * @param collectionAddress
 * @param tokenId
 * @returns NFT from API
 */
const getNftApi = async (collectionAddress: string, tokenId: string): Promise<ApiResponseSpecificToken['data']> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/tokens/${tokenId}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }

  console.error(`API: Can't fetch NFT token ${tokenId} in ${collectionAddress}`, res.status)
  return null
}

/**
 * Fetch a list of NFT from different collections
 * @param from Array of { collectionAddress: string; tokenId: string }
 * @returns Array of NFT from API
 */
export const getNftsFromDifferentCollectionsApi = async (
  from: { collectionAddress: string; tokenId: string }[],
): Promise<NftToken[]> => {
  const promises = from.map((nft) => getNftApi(nft.collectionAddress, nft.tokenId))
  const responses = await Promise.all(promises)
  // Sometimes API can't find some tokens (e.g. 404 response)
  // at least return the ones that returned successfully
  return responses
    .filter((resp) => resp)
    .map((res, index) => ({
      tokenId: res.tokenId,
      name: res.name,
      collectionName: res.collection.name,
      collectionAddress: from[index].collectionAddress,
      description: res.description,
      attributes: res.attributes,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      image: {
        original: res.image?.original,
        thumbnail: res.image?.thumbnail,
      },
    }))
}

/**
 * SUBGRAPH HELPERS
 */

/**
 * Fetch market data from a collection using the Subgraph
 * @returns
 */
export const getCollectionSg = async (collectionAddress: string): Promise<CollectionMarketDataBaseFields> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getCollectionData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            ${getCollectionBaseFields()}
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase() },
    )
    return res.collection
  } catch (error) {
    console.error('Failed to fetch collection', error)
    return null
  }
}

/**
 * Fetch market data from all collections using the Subgraph
 * @returns
 */
export const getCollectionsSg = async (): Promise<CollectionMarketDataBaseFields[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        {
          collections {
            ${getCollectionBaseFields()}
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
 * Fetch market data for all nfts in a collection using the Subgraph
 * @param collectionAddress
 * @returns
 */
export const getNftsFromCollectionSg = async (collectionAddress: string): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftCollectionMarketData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            id
            nfts {
             ${getBaseNftFields()}
            }
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase() },
    )
    return res.collection.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs from collection', error)
    return []
  }
}

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
          nfts(where: $where, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${getBaseNftFields()}
            transactionHistory {
              ${getBaseTransactionFields()}
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

/**
 * Returns the lowest price of any NFT in a collection
 */
export const getLowestPriceInCollection = async (collectionAddress: string) => {
  try {
    const response = await getNftsMarketData(
      { collection: collectionAddress.toLowerCase() },
      1,
      'currentAskPrice',
      'asc',
    )

    if (response.length === 0) {
      return 0
    }

    const [nftSg] = response
    return parseFloat(nftSg.currentAskPrice)
  } catch (error) {
    console.error(`Failed to lowest price NFTs in collection ${collectionAddress}`, error)
    return 0
  }
}

/**
 * Fetch user trading data for buyTradeHistory, sellTradeHistory and askOrderHistory from the Subgraph
 * @param where a User_filter where condition
 * @returns a UserActivity object
 */
export const getUserActivity = async (
  address: string,
): Promise<{ askOrderHistory: AskOrder[]; buyTradeHistory: Transaction[]; sellTradeHistory: Transaction[] }> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getUserActivity($address: String!) {
          user(id: $address) {
            buyTradeHistory(orderBy: timestamp) {
              ${getBaseTransactionFields()}
              nft {
                ${getBaseNftFields()}
              }
            }
            sellTradeHistory(orderBy: timestamp) {
              ${getBaseTransactionFields()}
              nft {
                ${getBaseNftFields()}
              }
            }
            askOrderHistory(orderBy: timestamp) {
              id
              block
              timestamp
              orderType
              askPrice
              nft {
                ${getBaseNftFields()}
              }
            }
          }
        }
      `,
      { address },
    )

    return res.user || { askOrderHistory: [], buyTradeHistory: [], sellTradeHistory: [] }
  } catch (error) {
    console.error('Failed to fetch user Activity', error)
    return {
      askOrderHistory: [],
      buyTradeHistory: [],
      sellTradeHistory: [],
    }
  }
}

/**
 * Get the most recently listed NFTs
 * @param first Number of nfts to retrieve
 * @returns NftTokenSg[]
 */
export const getLatestListedNfts = async (first: number): Promise<TokenMarketData[]> => {
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
 * OTHER HELPERS
 */

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
    const nftLocation = NftLocation.WALLET
    const tokensWithCollectionAddress = tokenIds.map((tokenId) => {
      return { tokenId, collectionAddress, nftLocation }
    })

    return tokensWithCollectionAddress
  })

  const walletNfts = await Promise.all(walletNftPromises)
  return walletNfts.flat()
}

/**
 * Helper to combine data from the collections' API and subgraph
 */
export const combineCollectionData = (
  collectionApiData: ApiCollection[],
  collectionSgData: CollectionMarketDataBaseFields[],
): Record<string, Collection> => {
  const collectionsMarketObj: Record<string, CollectionMarketDataBaseFields> = collectionSgData.reduce(
    (prev, current) => ({ ...prev, [current.id]: { ...current } }),
    {},
  )

  return collectionApiData.reduce((accum, current) => {
    const collectionMarket = collectionsMarketObj[current.address.toLowerCase()]
    const collection: Collection = {
      ...current,
      ...collectionMarket,
    }

    return {
      ...accum,
      [current.address]: collection,
    }
  }, {})
}

/**
 * Evaluate whether a market NFT is in a users wallet, their profile picture, or on sale
 * @param tokenId string
 * @param tokenIdsInWallet array of tokenIds in wallet
 * @param tokenIdsForSale array of tokenIds on sale
 * @param profileNftId Optional tokenId of users' profile picture
 * @returns NftLocation enum value
 */
export const getNftLocationForMarketNft = (
  tokenId: string,
  tokenIdsInWallet: string[],
  tokenIdsForSale: string[],
  profileNftId?: string,
): NftLocation => {
  if (tokenId === profileNftId) {
    return NftLocation.PROFILE
  }
  if (tokenIdsForSale.includes(tokenId)) {
    return NftLocation.FORSALE
  }
  if (tokenIdsInWallet.includes(tokenId)) {
    return NftLocation.WALLET
  }
  console.error(`Cannot determine location for tokenID ${tokenId}, defaulting to NftLocation.WALLET`)
  return NftLocation.WALLET
}

/**
 * Construct complete TokenMarketData entities with a users' wallet NFT ids and market data for their wallet NFTs
 * @param walletNfts TokenIdWithCollectionAddress
 * @param marketDataForWalletNfts TokenMarketData[]
 * @returns TokenMarketData[]
 */
export const attachMarketDataToWalletNfts = (
  walletNfts: TokenIdWithCollectionAddress[],
  marketDataForWalletNfts: TokenMarketData[],
): TokenMarketData[] => {
  const walletNftsWithMarketData = walletNfts.map((walletNft) => {
    const marketData = marketDataForWalletNfts.find((marketNft) => marketNft.tokenId === walletNft.tokenId)
    return (
      marketData ?? {
        tokenId: walletNft.tokenId,
        collection: {
          id: walletNft.collectionAddress.toLowerCase(),
        },
        nftLocation: walletNft.nftLocation,
        metadataUrl: null,
        transactionHistory: null,
        currentSeller: null,
        isTradable: null,
        currentAskPrice: null,
        latestTradedPriceInBNB: null,
        tradeVolumeBNB: null,
        totalTrades: null,
        otherId: null,
      }
    )
  })
  return walletNftsWithMarketData
}

/**
 * Attach TokenMarketData and location to NftToken
 * @param nftsWithMetadata NftToken[] with API metadata
 * @param nftsForSale  market data for nfts that are on sale (i.e. not in a user's wallet)
 * @param walletNfts makret data for nfts in a user's wallet
 * @param tokenIdsInWallet array of token ids in user's wallet
 * @param tokenIdsForSale array of token ids of nfts that are on sale
 * @param profileNftId profile picture token id
 * @returns NFT[]
 */
export const combineNftMarketAndMetadata = (
  nftsWithMetadata: NftToken[],
  nftsForSale: TokenMarketData[],
  walletNfts: TokenMarketData[],
  tokenIdsInWallet: string[],
  tokenIdsForSale: string[],
  profileNftId?: string,
): NftToken[] => {
  const completeNftData = nftsWithMetadata.map<NftToken>((nft) => {
    // Get metadata object
    const isOnSale = nftsForSale.filter((forSaleNft) => forSaleNft.tokenId === nft.tokenId).length > 0
    let marketData
    if (isOnSale) {
      marketData = nftsForSale.find((marketNft) => marketNft.tokenId === nft.tokenId)
    } else {
      marketData = walletNfts.find((marketNft) => marketNft.tokenId === nft.tokenId)
    }
    const location = getNftLocationForMarketNft(nft.tokenId, tokenIdsInWallet, tokenIdsForSale, profileNftId)
    return { ...nft, marketData, location }
  })
  return completeNftData
}
