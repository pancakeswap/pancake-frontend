import { request, gql } from 'graphql-request'
import { GRAPH_API_NFTMARKET, API_NFT } from 'config/constants/endpoints'
import { getErc721Contract } from 'utils/contractHelpers'
import { ethers } from 'ethers'
import map from 'lodash/map'
import { NftToken, ApiCollections, TokenIdWithCollectionAddress } from './types'

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
export const getNftsFromCollectionSg = async (collectionAddress: string): Promise<NftToken[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftCollectionMarketData($collectionAddress: String!) {
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
    console.error('Failed to fetch NFTs from collection', error)
    return []
  }
}

export const getNftsMarketData = async (where = {}): Promise<NftToken[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftsMarketData($where: NFT_filter) {
          nfts(where: $where) {
            tokenId
            metadataUrl
            currentSeller
            isTradable
            collection {
              id
            }
            transactionHistory {
              id
              block
              timestamp
              askPrice
              netPrice
              buyer {
                id
              }
              seller {
                id
              }
              withBNB
            }
          }
        }
      `,
      { where },
    )

    return res.nfts.map((nftRes): NftToken => {
      return {
        tokenId: nftRes?.tokenId,
        metadataUrl: nftRes?.metadataUrl,
        transactionHistory: nftRes?.transactionHistory,
        currentSeller: nftRes?.currentSeller,
        isTradable: nftRes?.isTradable,
        collectionAddress: nftRes?.collection.id,
      }
    })
  } catch (error) {
    console.error('Failed to fetch NFTs market data', error)
    return []
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
