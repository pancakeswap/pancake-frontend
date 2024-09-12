import { ChainId } from '@pancakeswap/chains'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { erc721CollectionABI } from 'config/abi/erc721collection'
import { nftMarketABI } from 'config/abi/nftMarket'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { API_NFT, GRAPH_API_NFTMARKET } from 'config/constants/endpoints'
import { COLLECTIONS_WITH_WALLET_OF_OWNER } from 'config/constants/nftsCollections'
import DELIST_COLLECTIONS from 'config/constants/nftsCollections/delist'
import { gql, request } from 'graphql-request'
import fromPairs from 'lodash/fromPairs'
import pickBy from 'lodash/pickBy'
import range from 'lodash/range'
import lodashSize from 'lodash/size'
import { safeGetAddress } from 'utils'
import { getNftMarketAddress } from 'utils/addressHelpers'
import { getNftMarketContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'
import { pancakeBunniesAddress } from './constants'
import { baseNftFields, baseTransactionFields, collectionBaseFields } from './queries'
import {
  ApiCollection,
  ApiCollections,
  ApiCollectionsResponse,
  ApiResponseCollectionTokens,
  ApiResponseSpecificToken,
  Collection,
  CollectionMarketDataBaseFields,
  NftLocation,
  NftToken,
  TokenIdWithCollectionAddress,
  TokenMarketData,
} from './type'

/**
 * Helper to combine data from the collections' API and subgraph
 */
export const combineCollectionData = (
  collectionApiData: ApiCollection[],
  collectionSgData: CollectionMarketDataBaseFields[],
): Record<string, Collection> => {
  const collectionsMarketObj: Record<string, CollectionMarketDataBaseFields> = fromPairs(
    collectionSgData.filter(Boolean).map((current) => [current.id, current]),
  )

  return fromPairs(
    collectionApiData
      .filter((collection) => collection?.address)
      .map((current) => {
        const collectionMarket = collectionsMarketObj[current.address.toLowerCase()]
        const collection: Collection = {
          ...current,
          ...collectionMarket,
        }

        if (current.name) {
          collection.name = current.name
        }

        return [current.address, collection]
      }),
  )
}

const fetchCollectionsTotalSupply = async (collections: ApiCollection[]): Promise<number[]> => {
  const totalSupplyCalls = collections
    .filter((collection) => collection?.address)
    .map(
      (collection) =>
        ({
          abi: erc721CollectionABI,
          address: collection.address as Address,
          functionName: 'totalSupply',
        } as const),
    )
  if (totalSupplyCalls.length > 0) {
    const client = publicClient({ chainId: ChainId.BSC })
    const totalSupplyRaw = await client.multicall({
      contracts: totalSupplyCalls,
    })

    const totalSupply = totalSupplyRaw.map((r) => r.result)
    return totalSupply.map((totalCount) => (totalCount ? Number(totalCount) : 0))
  }
  return []
}

/**
 * Fetch all collections data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollections = async (): Promise<Record<string, Collection> | null> => {
  try {
    const [collections] = await Promise.all([getCollectionsApi()])
    const collectionsMarket = []
    const collectionApiData: ApiCollection[] = collections?.data ?? []
    let collectionsTotalSupply: any
    try {
      collectionsTotalSupply = await fetchCollectionsTotalSupply(collectionApiData)
    } catch (error) {
      console.error('on chain fetch collections total supply error', error)
    }
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
 * Fetch static data from all collections using the API
 * @returns
 */
export const getCollectionsApi = async (): Promise<ApiCollectionsResponse | null> => {
  const res = await fetch(`${API_NFT}/collections`)
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
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
            ${collectionBaseFields}
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
 * @param size
 * @param page
 * @returns
 */
export const getNftsFromCollectionApi = async (
  collectionAddress: string,
  size = 100,
  page = 1,
): Promise<ApiResponseCollectionTokens | null> => {
  const isPBCollection = safeGetAddress(collectionAddress) === safeGetAddress(pancakeBunniesAddress)
  const requestPath = `${API_NFT}/collections/${collectionAddress}/tokens${
    !isPBCollection ? `?page=${page}&size=${size}` : ``
  }`

  try {
    const res = await fetch(requestPath)
    if (res.ok) {
      const data = await res.json()
      const filteredAttributesDistribution = pickBy(data.attributesDistribution, Boolean)
      const filteredData = pickBy(data.data, Boolean)
      const filteredTotal = lodashSize(filteredData)
      return {
        ...data,
        total: filteredTotal,
        attributesDistribution: filteredAttributesDistribution,
        data: filteredData,
      }
    }
    console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, res.statusText)
    return null
  } catch (error) {
    console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, error)
    return null
  }
}

export const fetchWalletTokenIdsForCollections = async (
  account: string,
  collections: ApiCollections,
): Promise<TokenIdWithCollectionAddress[]> => {
  const tokenOfOwnerByIndexCollections = Object.values(collections).filter(
    (c) => !COLLECTIONS_WITH_WALLET_OF_OWNER.includes(c.address),
  )
  const balanceOfCalls = tokenOfOwnerByIndexCollections.map((collection) => {
    const { address: collectionAddress } = collection
    return {
      abi: erc721CollectionABI,
      address: collectionAddress,
      functionName: 'balanceOf',
      args: [account as Address],
    } as const
  })

  const client = publicClient({ chainId: ChainId.BSC })

  const balanceOfCallsResultRaw = await client.multicall({
    contracts: balanceOfCalls,
    allowFailure: true,
  })

  const balanceOfCallsResult = balanceOfCallsResultRaw.map((r) => r.result)

  const tokenIdCalls = tokenOfOwnerByIndexCollections
    .map((collection, index) => {
      const balanceOf = balanceOfCallsResult[index] ? Number(balanceOfCallsResult[index]) : 0
      const { address: collectionAddress } = collection

      return range(balanceOf).map((tokenIndex) => {
        return {
          abi: erc721CollectionABI,
          address: collectionAddress,
          functionName: 'tokenOfOwnerByIndex',
          args: [account as Address, BigInt(tokenIndex)] as const,
        } as const
      })
    })
    .flat()

  const tokenIdResultRaw = await client.multicall({
    contracts: tokenIdCalls,
    allowFailure: true,
  })

  const tokenIdResult = tokenIdResultRaw.map((r) => r.result)

  const nftLocation = NftLocation.WALLET

  const walletNfts = tokenIdResult.reduce((acc, tokenIdBn, index) => {
    if (tokenIdBn) {
      const { address: collectionAddress } = tokenIdCalls[index]
      acc.push({ tokenId: tokenIdBn.toString(), collectionAddress, nftLocation })
    }
    return acc
  }, [] as TokenIdWithCollectionAddress[])

  const walletOfOwnerCalls = Object.values(collections)
    .filter((c) => COLLECTIONS_WITH_WALLET_OF_OWNER.includes(c.address))
    .map((c) => {
      return {
        abi: [
          {
            inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
            name: 'walletOfOwner',
            outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        address: c.address,
        functionName: 'walletOfOwner',
        args: [account as Address],
      } as const
    })

  const walletOfOwnerCallResult = await client.multicall({
    contracts: walletOfOwnerCalls,
    allowFailure: true,
  })

  const walletNftsWithWO = walletOfOwnerCallResult
    .map((r) => r.result)
    .reduce((acc, wo, index) => {
      if (wo) {
        const { address: collectionAddress } = walletOfOwnerCalls[index]
        acc.push(wo.map((w) => ({ tokenId: w.toString(), collectionAddress, nftLocation })))
      }
      return acc
    }, [] as any[][])

  return walletNfts.concat(walletNftsWithWO.flat())
}

export const getAccountNftsOnChainMarketData = async (
  collections: ApiCollections,
  account: Address,
): Promise<TokenMarketData[]> => {
  try {
    const nftMarketAddress = getNftMarketAddress()
    const collectionList = Object.values(collections)

    const call = collectionList.map((collection) => {
      const { address: collectionAddress } = collection
      return {
        abi: nftMarketABI,
        address: nftMarketAddress,
        functionName: 'viewAsksByCollectionAndSeller',
        args: [collectionAddress, account, 0n, 1000n] as const,
      } as const
    })

    const askCallsResultsRaw = await publicClient({ chainId: ChainId.BSC }).multicall({
      contracts: call,
      allowFailure: false,
    })

    const askCallsResults = askCallsResultsRaw
      .map((askCallsResultRaw, askCallIndex) => {
        const askCallsResult = {
          tokenIds: askCallsResultRaw?.[0],
          askInfo: askCallsResultRaw?.[1],
        }
        if (!askCallsResult?.tokenIds || !askCallsResult?.askInfo || !collectionList[askCallIndex]?.address) return null
        return askCallsResult.tokenIds
          .map((tokenId, tokenIdIndex) => {
            if (!tokenId || !askCallsResult.askInfo[tokenIdIndex] || !askCallsResult.askInfo[tokenIdIndex].price)
              return null

            const currentAskPrice = formatBigInt(askCallsResult.askInfo[tokenIdIndex].price)

            return {
              collection: { id: collectionList[askCallIndex].address.toLowerCase() as Address },
              tokenId: tokenId.toString(),
              account,
              isTradable: true,
              currentAskPrice,
            }
          })
          .filter(Boolean)
      })
      .flat()
      .filter(Boolean)

    // @ts-ignore FIXME: wagmi
    return askCallsResults
  } catch (error) {
    console.error('Failed to fetch NFTs onchain market data', error)
    return []
  }
}

/**
 * Fetch a single NFT using the API
 * @param collectionAddress
 * @param tokenId
 * @returns NFT from API
 */
export const getNftApi = async (
  collectionAddress: string,
  tokenId?: string,
): Promise<ApiResponseSpecificToken['data'] | null> => {
  if (!tokenId) return null

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
  from: Array<TokenIdWithCollectionAddress>,
): Promise<NftToken[]> => {
  const promises = from.map((nft) => getNftApi(nft.collectionAddress as Address, nft.tokenId))
  const responses = await Promise.all(promises)
  // Sometimes API can't find some tokens (e.g. 404 response)
  // at least return the ones that returned successfully

  const filtered = responses.filter(Boolean) as ApiResponseSpecificToken['data'][]
  return filtered.map((res, index) => ({
    tokenId: res.tokenId,
    name: res.name,
    collectionName: res.collection.name,
    collectionAddress: from[index].collectionAddress as Address,
    description: res.description,
    attributes: res.attributes,
    createdAt: res.createdAt,
    updatedAt: res.updatedAt,
    image: res.image,
  }))
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
    let marketData = nftsForSale.find(
      (forSaleNft) =>
        forSaleNft.tokenId === nft.tokenId &&
        forSaleNft.collection &&
        forSaleNft.collection.id === nft.collectionAddress,
    )
    if (!marketData) {
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

export const getNftsOnChainMarketData = async (
  collectionAddress: Address,
  tokenIds: string[],
): Promise<TokenMarketData[]> => {
  try {
    const nftMarketContract = getNftMarketContract()
    const response = await nftMarketContract.read.viewAsksByCollectionAndTokenIds([
      collectionAddress,
      tokenIds.map((t) => BigInt(t)),
    ])
    const askInfo = response[1]

    if (!askInfo) return []

    return askInfo
      .map((tokenAskInfo, index) => {
        if (!tokenAskInfo.seller || !tokenAskInfo.price) return null
        const currentSeller = tokenAskInfo.seller
        const isTradable = currentSeller.toLowerCase() !== NOT_ON_SALE_SELLER
        const currentAskPrice = tokenAskInfo.price && formatBigInt(tokenAskInfo.price)

        return {
          collection: { id: collectionAddress.toLowerCase() },
          tokenId: tokenIds[index],
          currentSeller,
          isTradable,
          currentAskPrice,
        }
      })
      .filter(Boolean) as TokenMarketData[]
  } catch (error) {
    console.error('Failed to fetch NFTs onchain market data', error)
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
  return walletNftsWithMarketData as TokenMarketData[]
}

/**
 * Get in-wallet, on-sale & profile pic NFT metadata, complete with market data for a given account
 * @param account
 * @param collections
 * @param profileNftWithCollectionAddress
 * @returns Promise<NftToken[]>
 */
export const getCompleteAccountNftData = async (
  account: Address,
  collections: ApiCollections,
  profileNftWithCollectionAddress?: TokenIdWithCollectionAddress,
): Promise<NftToken[]> => {
  // Add delist collections to allow user reclaim their NFTs
  const collectionsWithDelist = { ...collections, ...DELIST_COLLECTIONS }

  const onChainForSaleNfts = []
  const [walletNftIdsWithCollectionAddress] = await Promise.all([
    fetchWalletTokenIdsForCollections(account, collectionsWithDelist),
  ])

  if (profileNftWithCollectionAddress?.tokenId) {
    walletNftIdsWithCollectionAddress.unshift(profileNftWithCollectionAddress)
  }

  const walletNftsWithMarketData = []
  const walletTokenIds = []
  const tokenIdsForSale = []
  const metadataForAllNfts = await getNftsFromDifferentCollectionsApi([...walletNftIdsWithCollectionAddress])

  const completeNftData = combineNftMarketAndMetadata(
    metadataForAllNfts,
    onChainForSaleNfts,
    walletNftsWithMarketData,
    walletTokenIds,
    tokenIdsForSale,
    profileNftWithCollectionAddress?.tokenId,
  )

  return completeNftData
}

/**
 * Fetch static data from a collection using the API
 * @returns
 */
export const getCollectionApi = async (collectionAddress: string): Promise<ApiCollection | null> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }
  console.error(`API: Failed to fetch NFT collection ${collectionAddress}`, res.statusText)
  return null
}

/**
 * Fetch market data from a collection using the Subgraph
 * @returns
 */
export const getCollectionSg = async (collectionAddress: string): Promise<CollectionMarketDataBaseFields | null> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getCollectionData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            ${collectionBaseFields}
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
 * Fetch collection data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollection = async (collectionAddress: string): Promise<Record<string, Collection> | null> => {
  try {
    const [collection, collectionMarket] = await Promise.all([
      getCollectionApi(collectionAddress),
      getCollectionSg(collectionAddress),
    ])
    let collectionsTotalSupply
    try {
      collectionsTotalSupply = await fetchCollectionsTotalSupply(collection ? [collection] : [])
    } catch (error) {
      console.error('on chain fetch collections total supply error', error)
    }
    const totalSupplyFromApi = Number(collection?.totalSupply) || 0
    const totalSupplyFromOnChain = collectionsTotalSupply?.[0] || 0
    const collectionApiDataCombinedOnChain = {
      ...collection,
      totalSupply: Math.max(totalSupplyFromApi, totalSupplyFromOnChain).toString(),
    }

    return combineCollectionData(
      collectionApiDataCombinedOnChain ? [collectionApiDataCombinedOnChain as ApiCollection] : [],
      collectionMarket ? [collectionMarket] : [],
    )
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return null
  }
}
