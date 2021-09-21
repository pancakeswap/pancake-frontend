import { request, gql } from 'graphql-request'
import { GRAPH_API_NFTMARKET, API_NFT } from 'config/constants/endpoints'
import { getErc721Contract } from 'utils/contractHelpers'
import { ethers } from 'ethers'
import map from 'lodash/map'
import minBy from 'lodash/minBy'
import {
  NftTokenSg,
  ApiCollections,
  TokenIdWithCollectionAddress,
  NFT,
  UserActivity,
  NftLocation,
  Collection,
} from './types'
import { getBaseNftFields, getBaseTransactionFields, getCollectionBaseFields } from './queries'

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
 * Fetch static data from a collection using the API
 * @returns
 */
export const getCollectionApi = async (collectionAddress: string) => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }
  console.error('Failed to fetch NFT collection', res.statusText)
  return []
}

/**
 * Fetch market data from a collection using the Subgraph
 * @returns
 */
export const getCollectionSg = async (collectionAddress: string): Promise<any[]> => {
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
    return []
  }
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
  return responses.map((res, index) => ({
    tokenId: res.tokenId,
    name: res.name,
    collectionName: res.collection.name,
    collectionAddress: from[index].collectionAddress,
    description: res.description,
    updatedAt: res.updatedAt,
    attributes: res.attributes,
    image: {
      original: res.image?.original,
      thumbnail: res.image?.thumbnail,
    },
  }))
}

/**
 * Helper to combine data from the collections' API and subgraph
 * TODO: Type this properly
 */
export const combineCollectionData = (collectionApiData: any, collectionSgData: any): Record<string, Collection> => {
  const collectionsMarketObj = collectionSgData.reduce(
    (prev, current) => ({ ...prev, [current.id]: { ...current } }),
    {},
  )

  return collectionApiData.reduce((accum, current) => {
    const collectionMarket = collectionsMarketObj[current.address.toLowerCase()]

    return {
      ...accum,
      [current.address]: {
        ...current,
        active: collectionMarket.active,
        totalVolumeBNB: collectionMarket.totalVolumeBNB,
        numberTokensListed: collectionMarket.numberTokensListed,
        tradingFee: collectionMarket.tradingFee,
        creatorFee: collectionMarket.creatorFee,
      },
    }
  }, {})
}

/**
 * Evaluate whether a market NFT is in a users wallet, their profile picture, or on sale
 * @param marketNft NftTokenSg
 * @param account account string
 * @param profileNftId Optional tokenId of users' profile picture
 * @returns NftLocation enum value
 */
export const getNftLocationForMarketNft = (
  marketNft: NftTokenSg,
  account: string,
  profileNftId?: string,
): NftLocation => {
  if (profileNftId === marketNft.tokenId) {
    return NftLocation.PROFILE
  }
  if (marketNft.isTradable && marketNft.currentSeller === account.toLowerCase()) {
    return NftLocation.FORSALE
  }
  return NftLocation.WALLET
}

/**
 * Construct complete NftTokenSg entities with a users' wallet NFT ids and market data for their wallet NFTs
 * @param walletNfts { collectionAddress: string, tokenId: string, nftLocation?: NftLocation}[]
 * @param marketDataForWalletNfts NftTokenSg[]
 * @param account account string
 * @param profileNftId tokenId of a users' profile picture
 * @returns NftTokenSg[]
 */
export const attachMarketDataToWalletNfts = (
  walletNfts: TokenIdWithCollectionAddress[],
  marketDataForWalletNfts: NftTokenSg[],
  account: string,
  profileNftId: string,
): NftTokenSg[] => {
  const walletNftsWithMarketData = walletNfts.map((walletNft) => {
    const marketData = marketDataForWalletNfts.find((marketNft) => marketNft.tokenId === walletNft.tokenId)
    return marketData
      ? {
          ...marketData,
          nftLocation: getNftLocationForMarketNft(marketData, account, profileNftId),
        }
      : {
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
        }
  })
  return walletNftsWithMarketData
}

/**
 * Attach NftTokenSg data to NFT metadata's tokens object
 * @param nftsWithMetadata NFT[] with and empty tokens object
 * @param nftsForSale nfts that are on sale (i.e. not in a user's wallet)
 * @param walletNfts nfts in a user's wallet
 * @returns NFT[]
 */
export const combineNftMarketAndMetadata = (
  nftsWithMetadata: NFT[],
  nftsForSale: NftTokenSg[],
  walletNfts: NftTokenSg[],
): NFT[] => {
  const completeNftData = nftsWithMetadata.map((nft: NFT): NFT => {
    const isOnSale = nftsForSale.filter((forSaleNft) => forSaleNft.tokenId === nft.tokenId).length > 0
    let marketDataForNft
    if (isOnSale) {
      marketDataForNft = nftsForSale.find((marketNft) => marketNft.tokenId === nft.tokenId)
    } else {
      marketDataForNft = walletNfts.find((marketNft) => marketNft.tokenId === nft.tokenId)
    }
    const tokensObj = { [nft.tokenId]: marketDataForNft }
    return { ...nft, tokens: tokensObj }
  })
  return completeNftData
}

/*
 * Filter heloper: Get lowest token price from NFT
 */
export const getLowestPriceFromNft = (nft: NFT) => {
  const { tokens } = nft
  const minTokenPrice = minBy(Object.values(tokens), (token) => (token ? parseFloat(token.currentAskPrice) : 0))
  return minTokenPrice ? parseFloat(minTokenPrice.currentAskPrice) : 0
}

/**
 * Filter heloper: Get updated at as a number
 */
export const getLastUpdatedFromNft = (nft: NFT) => {
  return Number(nft.updatedAt)
}
