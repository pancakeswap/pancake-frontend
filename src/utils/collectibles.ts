import nfts from 'config/constants/nfts'
import { IPFS_GATEWAY } from 'config'
import collections from 'config/constants/nfts/collections'
import { Nft, CollectionKey } from 'config/constants/nfts/types'
import { getAddress } from './addressHelpers'
import { getErc721Contract } from './contractHelpers'

/**
 * Some sources like Pancake do not return HTTP tokenURI's
 */
export const getTokenUrl = (tokenUri: string) => {
  if (tokenUri.startsWith('ipfs://')) {
    return `${IPFS_GATEWAY}/${tokenUri.slice(6)}`
  }

  return tokenUri
}

export const getBunnyNftAddress = (collectionKey: CollectionKey = CollectionKey.PANCAKE) => {
  return getAddress(collections[collectionKey].address)
}

export const fetchCachedUriData = async (tokenUrl: string) => {
  try {
    const localUriData = localStorage.getItem(tokenUrl)

    if (localUriData) {
      const data = JSON.parse(localUriData)
      return data
    }

    const uriDataResponse = await fetch(tokenUrl)

    if (!uriDataResponse.ok) {
      throw new Error('Unable to fetch uriData')
    }

    const uriData = await uriDataResponse.json()
    localStorage.setItem(tokenUrl, JSON.stringify(uriData))
    return uriData
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getTokenUriData = async (nftAddress: string, tokenId: number) => {
  try {
    const contract = getErc721Contract(nftAddress)
    const tokenUri = await contract.tokenURI(tokenId)
    const uriData = await fetchCachedUriData(getTokenUrl(tokenUri))

    if (!uriData) {
      return null
    }

    return uriData
  } catch (error) {
    console.error('getTokenUriData', error)
    return null
  }
}

export const getNftByTokenId = async (nftAddress: string, tokenId: number): Promise<Nft | null> => {
  const uriData = await getTokenUriData(nftAddress, tokenId)

  // Bail out early if we have no uriData, identifierKey, or the value does not
  // exist in the object
  if (!uriData) {
    return null
  }

  return nfts.pancake.find((nft) => {
    return uriData.image.includes(nft.identifier)
  })
}
