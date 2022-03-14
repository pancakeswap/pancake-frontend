import { gql, request } from 'graphql-request'
import { stringify } from 'querystring'
import { API_NFT, GRAPH_API_NFTMARKET } from 'config/constants/endpoints'
import { multicallv2 } from 'utils/multicall'
import erc721Abi from 'config/abi/erc721.json'
import range from 'lodash/range'
import uniq from 'lodash/uniq'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import {
  ApiCollection,
  ApiCollections,
  ApiResponseCollectionTokens,
  ApiResponseSpecificToken,
  AskOrderType,
  Collection,
  CollectionMarketDataBaseFields,
  NftActivityFilter,
  NftLocation,
  NftToken,
  TokenIdWithCollectionAddress,
  TokenMarketData,
  Transaction,
  AskOrder,
  ApiSingleTokenData,
  NftAttribute,
  ApiTokenFilterResponse,
  ApiCollectionsResponse,
  MarketEvent,
} from './types'
import { getBaseNftFields, getBaseTransactionFields, getCollectionBaseFields } from './queries'

/**
 * API HELPERS
 */

/**
 * Fetch static data from all collections using the API
 * @returns
 */
export const getCollectionsApi = async (): Promise<ApiCollectionsResponse> => {
  const res = await fetch(`${API_NFT}/collections`)
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const fetchCollectionsTotalSupply = async (collections: ApiCollection[]): Promise<number[]> => {
  const totalSupplyCalls = collections
    .filter((collection) => collection?.address)
    .map((collection) => ({
      address: collection.address.toLowerCase(),
      name: 'totalSupply',
    }))
  if (totalSupplyCalls.length > 0) {
    const totalSupplyRaw = await multicallv2(erc721Abi, totalSupplyCalls, { requireSuccess: false })
    const totalSupply = totalSupplyRaw.flat()
    return totalSupply.map((totalCount) => (totalCount ? totalCount.toNumber() : 0))
  }
  return []
}

/**
 * Fetch all collections data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollections = async (): Promise<Record<string, Collection>> => {
  try {
    const [collections, collectionsMarket] = await Promise.all([getCollectionsApi(), getCollectionsSg()])
    const collectionApiData: ApiCollection[] = collections?.data ?? []
    const collectionsTotalSupply = await fetchCollectionsTotalSupply(collectionApiData)
    const collectionApiDataCombinedOnChain = collectionApiData.map((collection, index) => {
      const totalSupplyFromApi = Number(collection?.totalSupply) || 0
      const totalSupplyFromOnChain = collectionsTotalSupply[index]
      return {
        ...collection,
        totalSupply: Math.max(totalSupplyFromApi, totalSupplyFromOnChain).toString(),
      }
    })

    return combineCollectionData(collectionApiDataCombinedOnChain, collectionsMarket)
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return null
  }
}

/**
 * Fetch collection data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollection = async (collectionAddress: string): Promise<Record<string, Collection> | null> => {
  try {
    const [collection, collectionMarket] = await Promise.all([
      getCollectionApi(collectionAddress),
      getCollectionSg(collectionAddress),
    ])

    const collectionsTotalSupply = await fetchCollectionsTotalSupply([collection])
    const totalSupplyFromApi = Number(collection?.totalSupply) || 0
    const totalSupplyFromOnChain = collectionsTotalSupply[0]
    const collectionApiDataCombinedOnChain = {
      ...collection,
      totalSupply: Math.max(totalSupplyFromApi, totalSupplyFromOnChain).toString(),
    }

    return combineCollectionData([collectionApiDataCombinedOnChain], [collectionMarket])
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return null
  }
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
 * @param size
 * @param page
 * @returns
 */
export const getNftsFromCollectionApi = async (
  collectionAddress: string,
  size = 100,
  page = 1,
): Promise<ApiResponseCollectionTokens> => {
  const isPBCollection = collectionAddress.toLowerCase() === pancakeBunniesAddress.toLowerCase()
  const requestPath = `${API_NFT}/collections/${collectionAddress}/tokens${
    !isPBCollection ? `?page=${page}&size=${size}` : ``
  }`

  const res = await fetch(requestPath)
  if (res.ok) {
    const data = await res.json()
    return data
  }
  console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, res.statusText)
  return null
}

/**
 * Fetch a single NFT using the API
 * @param collectionAddress
 * @param tokenId
 * @returns NFT from API
 */
export const getNftApi = async (
  collectionAddress: string,
  tokenId: string,
): Promise<ApiResponseSpecificToken['data']> => {
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
      image: res.image,
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
 * Fetch market data for nfts in a collection using the Subgraph
 * @param collectionAddress
 * @param first
 * @param skip
 * @returns
 */
export const getNftsFromCollectionSg = async (
  collectionAddress: string,
  first = 1000,
  skip = 0,
): Promise<TokenMarketData[]> => {
  // Squad to be sorted by tokenId as this matches the order of the paginated API return. For PBs - get the most recent,
  const isPBCollection = collectionAddress.toLowerCase() === pancakeBunniesAddress.toLowerCase()

  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftCollectionMarketData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            id
            nfts(orderBy:${isPBCollection ? 'updatedAt' : 'tokenId'}, skip: $skip, first: $first) {
             ${getBaseNftFields()}
            }
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase(), skip, first },
    )
    return res.collection.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs from collection', error)
    return []
  }
}

/**
 * Fetch market data for PancakeBunnies NFTs by bunny id using the Subgraph
 * @param bunnyId - bunny id to query
 * @param existingTokenIds - tokens that are already loaded into redux
 * @returns
 */
export const getNftsByBunnyIdSg = async (
  bunnyId: string,
  existingTokenIds: string[],
  orderDirection: 'asc' | 'desc',
): Promise<TokenMarketData[]> => {
  try {
    const where =
      existingTokenIds.length > 0
        ? { otherId: bunnyId, isTradable: true, tokenId_not_in: existingTokenIds }
        : { otherId: bunnyId, isTradable: true }
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftsByBunnyIdSg($collectionAddress: String!, $where: NFT_filter, $orderDirection: String!) {
          nfts(first: 30, where: $where, orderBy: currentAskPrice, orderDirection: $orderDirection) {
            ${getBaseNftFields()}
          }
        }
      `,
      {
        collectionAddress: pancakeBunniesAddress.toLowerCase(),
        where,
        orderDirection,
      },
    )
    return res.nfts
  } catch (error) {
    console.error(`Failed to fetch collection NFTs for bunny id ${bunnyId}`, error)
    return []
  }
}

/**
 * Fetch market data for PancakeBunnies NFTs by bunny id using the Subgraph
 * @param bunnyId - bunny id to query
 * @param existingTokenIds - tokens that are already loaded into redux
 * @returns
 */
export const getMarketDataForTokenIds = async (
  collectionAddress: string,
  existingTokenIds: string[],
): Promise<TokenMarketData[]> => {
  try {
    if (existingTokenIds.length === 0) {
      return []
    }
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getMarketDataForTokenIds($collectionAddress: String!, $where: NFT_filter) {
          collection(id: $collectionAddress) {
            id
            nfts(first: 1000, where: $where) {
              ${getBaseNftFields()}
            }
          }
        }
      `,
      {
        collectionAddress: collectionAddress.toLowerCase(),
        where: { tokenId_in: existingTokenIds },
      },
    )
    return res.collection.nfts
  } catch (error) {
    console.error(`Failed to fetch market data for NFTs stored tokens`, error)
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
          nfts(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
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

export const getAllPancakeBunniesLowestPrice = async (bunnyIds: string[]): Promise<Record<string, number>> => {
  try {
    const singlePancakeBunnySubQueries = bunnyIds.map(
      (
        bunnyId,
      ) => `b${bunnyId}:nfts(first: 1, where: { otherId: ${bunnyId}, isTradable: true }, orderBy: currentAskPrice, orderDirection: asc) {
        currentAskPrice
      }
    `,
    )
    const rawResponse: Record<string, { currentAskPrice: string }[]> = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getAllPancakeBunniesLowestPrice {
          ${singlePancakeBunnySubQueries}
        }
      `,
    )
    return Object.keys(rawResponse).reduce((lowestPricesData, subQueryKey) => {
      const bunnyId = subQueryKey.split('b')[1]
      return {
        ...lowestPricesData,
        [bunnyId]:
          rawResponse[subQueryKey].length > 0 ? parseFloat(rawResponse[subQueryKey][0].currentAskPrice) : Infinity,
      }
    }, {})
  } catch (error) {
    console.error('Failed to fetch PancakeBunnies lowest prices', error)
    return {}
  }
}

export const getAllPancakeBunniesRecentUpdatedAt = async (bunnyIds: string[]): Promise<Record<string, number>> => {
  try {
    const singlePancakeBunnySubQueries = bunnyIds.map(
      (
        bunnyId,
      ) => `b${bunnyId}:nfts(first: 1, where: { otherId: ${bunnyId}, isTradable: true }, orderBy: updatedAt, orderDirection: desc) {
        updatedAt
      }
    `,
    )
    const rawResponse: Record<string, { updatedAt: string }[]> = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getAllPancakeBunniesLowestPrice {
          ${singlePancakeBunnySubQueries}
        }
      `,
    )
    return Object.keys(rawResponse).reduce((updatedAtData, subQueryKey) => {
      const bunnyId = subQueryKey.split('b')[1]
      return {
        ...updatedAtData,
        [bunnyId]: rawResponse[subQueryKey].length > 0 ? Number(rawResponse[subQueryKey][0].updatedAt) : -Infinity,
      }
    }, {})
  } catch (error) {
    console.error('Failed to fetch PancakeBunnies latest market updates', error)
    return {}
  }
}

/**
 * Returns the lowest/highest price of any NFT in a collection
 */
export const getLeastMostPriceInCollection = async (
  collectionAddress: string,
  orderDirection: 'asc' | 'desc' = 'asc',
) => {
  try {
    const response = await getNftsMarketData(
      { collection: collectionAddress.toLowerCase(), isTradable: true },
      1,
      'currentAskPrice',
      orderDirection,
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
            buyTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
              ${getBaseTransactionFields()}
              nft {
                ${getBaseNftFields()}
              }
            }
            sellTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
              ${getBaseTransactionFields()}
              nft {
                ${getBaseNftFields()}
              }
            }
            askOrderHistory(first: 500, orderBy: timestamp, orderDirection: desc) {
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

export const getCollectionActivity = async (
  address: string,
  nftActivityFilter: NftActivityFilter,
  itemPerQuery,
): Promise<{ askOrders?: AskOrder[]; transactions?: Transaction[] }> => {
  const getAskOrderEvent = (orderType: MarketEvent): AskOrderType => {
    switch (orderType) {
      case MarketEvent.CANCEL:
        return AskOrderType.CANCEL
      case MarketEvent.MODIFY:
        return AskOrderType.MODIFY
      case MarketEvent.NEW:
        return AskOrderType.NEW
      default:
        return AskOrderType.MODIFY
    }
  }

  const isFetchAllCollections = address === ''

  const hasCollectionFilter = nftActivityFilter.collectionFilters.length > 0

  const collectionFilterGql = !isFetchAllCollections
    ? `collection: ${JSON.stringify(address)}`
    : hasCollectionFilter
    ? `collection_in: ${JSON.stringify(nftActivityFilter.collectionFilters)}`
    : ``

  const askOrderTypeFilter = nftActivityFilter.typeFilters
    .filter((marketEvent) => marketEvent !== MarketEvent.SELL)
    .map((marketEvent) => getAskOrderEvent(marketEvent))

  const askOrderIncluded = nftActivityFilter.typeFilters.length === 0 || askOrderTypeFilter.length > 0

  const askOrderTypeFilterGql =
    askOrderTypeFilter.length > 0 ? `orderType_in: ${JSON.stringify(askOrderTypeFilter)}` : ``

  const transactionIncluded =
    nftActivityFilter.typeFilters.length === 0 ||
    nftActivityFilter.typeFilters.some(
      (marketEvent) => marketEvent === MarketEvent.BUY || marketEvent === MarketEvent.SELL,
    )

  let askOrderQueryItem = itemPerQuery / 2
  let transactionQueryItem = itemPerQuery / 2

  if (!askOrderIncluded || !transactionIncluded) {
    askOrderQueryItem = !askOrderIncluded ? 0 : itemPerQuery
    transactionQueryItem = !transactionIncluded ? 0 : itemPerQuery
  }

  const askOrderGql = askOrderIncluded
    ? `askOrders(first: ${askOrderQueryItem}, orderBy: timestamp, orderDirection: desc, where:{
            ${collectionFilterGql}, ${askOrderTypeFilterGql}
          }) {
              id
              block
              timestamp
              orderType
              askPrice
              seller {
                id
              }
              nft {
                ${getBaseNftFields()}
              }
          }`
    : ``

  const transactionGql = transactionIncluded
    ? `transactions(first: ${transactionQueryItem}, orderBy: timestamp, orderDirection: desc, where:{
            ${collectionFilterGql}
          }) {
            ${getBaseTransactionFields()}
              nft {
                ${getBaseNftFields()}
              }
          }`
    : ``

  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getCollectionActivity {
          ${askOrderGql}
          ${transactionGql}
        }
      `,
    )

    return res || { askOrders: [], transactions: [] }
  } catch (error) {
    console.error('Failed to fetch collection Activity', error)
    return {
      askOrders: [],
      transactions: [],
    }
  }
}

export const getTokenActivity = async (
  tokenId: string,
  collectionAddress: string,
): Promise<{ askOrders: AskOrder[]; transactions: Transaction[] }> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getCollectionActivity($tokenId: BigInt!, $address: ID!) {
          nfts(where:{tokenId: $tokenId, collection: $address}) {
            transactionHistory(orderBy: timestamp, orderDirection: desc) {
              ${getBaseTransactionFields()}
                nft {
                  ${getBaseNftFields()}
                }
            }
            askHistory(orderBy: timestamp, orderDirection: desc) {
                id
                block
                timestamp
                orderType
                askPrice
                seller {
                  id
                }
                nft {
                  ${getBaseNftFields()}
                }
            }
          }
        }
      `,
      { tokenId, address: collectionAddress },
    )

    if (res.nfts.length > 0) {
      return { askOrders: res.nfts[0].askHistory, transactions: res.nfts[0].transactionHistory }
    }
    return { askOrders: [], transactions: [] }
  } catch (error) {
    console.error('Failed to fetch token Activity', error)
    return {
      askOrders: [],
      transactions: [],
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
          nfts(where: { isTradable: true }, orderBy: updatedAt , orderDirection: desc, first: $first) {
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
 * Filter NFTs from a collection
 * @param collectionAddress
 * @returns
 */
export const fetchNftsFiltered = async (
  collectionAddress: string,
  filters: Record<string, string | number>,
): Promise<ApiTokenFilterResponse> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/filter?${stringify(filters)}`)

  if (res.ok) {
    const data = await res.json()
    return data
  }

  console.error(`API: Failed to fetch NFT collection ${collectionAddress}`, res.statusText)
  return null
}

/**
 * OTHER HELPERS
 */

export const getMetadataWithFallback = (apiMetadata: ApiResponseCollectionTokens['data'], bunnyId: string) => {
  // The fallback is just for the testnet where some bunnies don't exist
  return (
    apiMetadata[bunnyId] ?? {
      name: '',
      description: '',
      collection: { name: 'Pancake Bunnies' },
      image: {
        original: '',
        thumbnail: '',
      },
    }
  )
}

export const getPancakeBunniesAttributesField = (bunnyId: string) => {
  // Generating attributes field that is not returned by API
  // but can be "faked" since objects are keyed with bunny id
  return [
    {
      traitType: 'bunnyId',
      value: bunnyId,
      displayType: null,
    },
  ]
}

export const combineApiAndSgResponseToNftToken = (
  apiMetadata: ApiSingleTokenData,
  marketData: TokenMarketData,
  attributes: NftAttribute[],
) => {
  return {
    tokenId: marketData.tokenId,
    name: apiMetadata.name,
    description: apiMetadata.description,
    collectionName: apiMetadata.collection.name,
    collectionAddress: pancakeBunniesAddress,
    image: apiMetadata.image,
    marketData,
    attributes,
  }
}

export const fetchWalletTokenIdsForCollections = async (
  account: string,
  collections: ApiCollections,
): Promise<TokenIdWithCollectionAddress[]> => {
  const balanceOfCalls = Object.values(collections).map((collection) => {
    const { address: collectionAddress } = collection
    return {
      address: collectionAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const balanceOfCallsResultRaw = await multicallv2(erc721Abi, balanceOfCalls, { requireSuccess: false })
  const balanceOfCallsResult = balanceOfCallsResultRaw.flat()

  const tokenIdCalls = Object.values(collections)
    .map((collection, index) => {
      const balanceOf = balanceOfCallsResult[index]?.toNumber() ?? 0
      const { address: collectionAddress } = collection

      return range(balanceOf).map((tokenIndex) => {
        return {
          address: collectionAddress,
          name: 'tokenOfOwnerByIndex',
          params: [account, tokenIndex],
        }
      })
    })
    .flat()

  const tokenIdResultRaw = await multicallv2(erc721Abi, tokenIdCalls, { requireSuccess: false })
  const tokenIdResult = tokenIdResultRaw.flat()

  const nftLocation = NftLocation.WALLET

  const walletNfts = tokenIdResult.reduce((acc, tokenIdBn, index) => {
    if (tokenIdBn) {
      const { address: collectionAddress } = tokenIdCalls[index]
      acc.push({ tokenId: tokenIdBn.toString(), collectionAddress, nftLocation })
    }
    return acc
  }, [])

  return walletNfts
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

  return collectionApiData
    .filter((collection) => collection?.address)
    .reduce((accum, current) => {
      const collectionMarket = collectionsMarketObj[current.address.toLowerCase()]
      const collection: Collection = {
        ...current,
        ...collectionMarket,
      }

      if (current.name) {
        collection.name = current.name
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
    const marketData = marketDataForWalletNfts.find(
      (marketNft) =>
        marketNft.tokenId === walletNft.tokenId &&
        marketNft.collection.id.toLowerCase() === walletNft.collectionAddress.toLowerCase(),
    )
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
 * @param walletNfts market data for nfts in a user's wallet
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
    const isOnSale =
      nftsForSale.filter(
        (forSaleNft) =>
          forSaleNft.tokenId === nft.tokenId &&
          forSaleNft.collection &&
          forSaleNft.collection.id === nft.collectionAddress,
      ).length > 0
    let marketData
    if (isOnSale) {
      marketData = nftsForSale.find(
        (marketNft) =>
          marketNft.collection &&
          marketNft.collection.id === nft.collectionAddress &&
          marketNft.tokenId === nft.tokenId,
      )
    } else {
      marketData = walletNfts.find(
        (marketNft) =>
          marketNft.collection &&
          marketNft.collection.id === nft.collectionAddress &&
          marketNft.tokenId === nft.tokenId,
      )
    }
    const location = getNftLocationForMarketNft(nft.tokenId, tokenIdsInWallet, tokenIdsForSale, profileNftId)
    return { ...nft, marketData, location }
  })
  return completeNftData
}

/**
 * Get in-wallet, on-sale & profile pic NFT metadata, complete with market data for a given account
 * @param account
 * @param collections
 * @param profileNftWithCollectionAddress
 * @returns Promise<NftToken[]>
 */
export const getCompleteAccountNftData = async (
  account: string,
  collections: ApiCollections,
  profileNftWithCollectionAddress?: TokenIdWithCollectionAddress,
): Promise<NftToken[]> => {
  const walletNftIdsWithCollectionAddress = await fetchWalletTokenIdsForCollections(account, collections)
  if (profileNftWithCollectionAddress?.tokenId) {
    walletNftIdsWithCollectionAddress.unshift(profileNftWithCollectionAddress)
  }

  const uniqueCollectionAddresses = uniq(
    walletNftIdsWithCollectionAddress.map((walletNftId) => walletNftId.collectionAddress),
  )

  const walletNftsByCollection = uniqueCollectionAddresses.map((collectionAddress) => {
    return {
      collectionAddress,
      idWithCollectionAddress: walletNftIdsWithCollectionAddress.filter(
        (walletNft) => walletNft.collectionAddress === collectionAddress,
      ),
    }
  })

  const walletMarketDataRequests = walletNftsByCollection.map((walletNftByCollection) => {
    const tokenIdIn = walletNftByCollection.idWithCollectionAddress.map((walletNft) => walletNft.tokenId)
    return getNftsMarketData({
      tokenId_in: tokenIdIn,
      collection: walletNftByCollection.collectionAddress.toLowerCase(),
    })
  })

  const walletMarketDataResponses = await Promise.all(walletMarketDataRequests)
  const walletMarketData = walletMarketDataResponses.flat()

  const walletNftsWithMarketData = attachMarketDataToWalletNfts(walletNftIdsWithCollectionAddress, walletMarketData)

  const walletTokenIds = walletNftIdsWithCollectionAddress
    .filter((walletNft) => {
      // Profile Pic NFT is no longer wanted in this array, hence the filter
      return profileNftWithCollectionAddress?.tokenId !== walletNft.tokenId
    })
    .map((nft) => nft.tokenId)

  const marketDataForSaleNfts = await getNftsMarketData({ currentSeller: account.toLowerCase() })
  const tokenIdsForSale = marketDataForSaleNfts.map((nft) => nft.tokenId)

  const forSaleNftIds = marketDataForSaleNfts.map((nft) => {
    return { collectionAddress: nft.collection.id, tokenId: nft.tokenId }
  })

  const metadataForAllNfts = await getNftsFromDifferentCollectionsApi([
    ...forSaleNftIds,
    ...walletNftIdsWithCollectionAddress,
  ])

  const completeNftData = combineNftMarketAndMetadata(
    metadataForAllNfts,
    marketDataForSaleNfts,
    walletNftsWithMarketData,
    walletTokenIds,
    tokenIdsForSale,
    profileNftWithCollectionAddress?.tokenId,
  )

  return completeNftData
}

/**
 * Fetch distribution information for a collection
 * @returns
 */
export const getCollectionDistributionApi = async <T>(collectionAddress: string): Promise<T> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/distribution`)
  if (res.ok) {
    const data = await res.json()
    return data
  }
  console.error(`API: Failed to fetch NFT collection ${collectionAddress} distribution`, res.statusText)
  return null
}
