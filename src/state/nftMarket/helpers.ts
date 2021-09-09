import { request, gql } from 'graphql-request'
import { GRAPH_API_NFTMARKET, API_NFT } from 'config/constants/endpoints'
import { NftToken } from './types'
import { collections } from 'config/constants/nfts'
import { getAddress } from 'utils/addressHelpers'
import { getErc721Contract } from 'utils/contractHelpers'
import { ethers } from 'ethers'

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

export const getNftsMarketData = async (where = {}): Promise<NftSubgraphEntity[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftsMarketData($where: NFT_filter) {
          nfts(where: $where) {
            tokenId
            metadataUrl
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

    return res.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs market data', error)
    return []
  }
}

export const fetchWalletNftIds = async (account: string): Promise<string[]> => {
  const nftIdPromises = Object.keys(collections).map(async (nftCollectionKey) => {
    // Temporarily skip over pancake-squad
    if (collections[nftCollectionKey].slug === 'pancake-squad') {
      return []
    }

    const { address: addressObj } = collections[nftCollectionKey]
    const contractAddress = getAddress(addressObj)
    const contract = getErc721Contract(contractAddress)
    const balanceOfResponse = await contract.balanceOf(account)
    const balanceOf = balanceOfResponse.toNumber()

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

    const nftDataFetchPromises = []

    // For each index get the tokenId
    for (let i = 0; i < balanceOf; i++) {
      nftDataFetchPromises.push(getTokenId(i))
    }

    return Promise.all(nftDataFetchPromises)
  })

  const nftIds = await Promise.all(nftIdPromises)

  // flatten Ids across collections into one array
  return nftIds.flat()
}
