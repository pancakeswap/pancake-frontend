import Nfts, { IPFS_GATEWAY, nftSources } from 'config/constants/nfts'
import { Nft, NftType } from 'config/constants/types'
import { getAddress } from './addressHelpers'
import { getErc721Contract } from './contractHelpers'

/**
 * Gets the identifier key based on the nft address
 * Helpful for looking up the key when all you have is the address
 */
export const getIdentifierKeyFromAddress = (nftAddress: string) => {
  const nftSource = Object.values(nftSources).find((nftSourceEntry) => {
    const address = getAddress(nftSourceEntry.address)
    return address === nftAddress
  })

  return nftSource ? nftSource.identifierKey : null
}

/**
 * Some sources like Pancake do not return HTTP tokenURI's
 */
export const getTokenUrl = (tokenUri: string) => {
  if (tokenUri.startsWith('ipfs://')) {
    return `${IPFS_GATEWAY}/${tokenUri.slice(6)}`
  }

  return tokenUri
}

export const getAddressByType = (type: NftType) => {
  return getAddress(nftSources[type].address)
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
  const identifierKey = getIdentifierKeyFromAddress(nftAddress)

  // Bail out early if we have no uriData, identifierKey, or the value does not
  // exist in the object
  if (!uriData) {
    return null
  }

  if (!identifierKey) {
    return null
  }

  if (!uriData[identifierKey]) {
    return null
  }

  return Nfts.find((nft) => {
    return uriData[identifierKey].includes(nft.identifier)
  })
}
