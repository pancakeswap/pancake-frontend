import { ChainId } from '@pancakeswap/chains'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { API_NFT } from 'config/constants/endpoints'
import { getTeam } from 'hooks/useProfile/team/helpers'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'
import { getUsername } from './getUsername'
import { transformProfileResponse } from './transformProfileResponse'
import { ApiResponseSpecificToken, GetProfileResponse, NftToken, Profile } from './type'

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

export const getProfile = async (address: string): Promise<GetProfileResponse | null> => {
  try {
    const client = publicClient({ chainId: ChainId.BSC })

    const profileCallsResult = await client.multicall({
      contracts: [
        {
          address: getPancakeProfileAddress(),
          abi: pancakeProfileABI,
          functionName: 'hasRegistered',
          args: [address as Address],
        },
        {
          address: getPancakeProfileAddress(),
          abi: pancakeProfileABI,
          functionName: 'getUserProfile',
          args: [address as Address],
        },
      ],
    })

    const [{ result: hasRegistered }, { result: profileResponse }] = profileCallsResult
    if (!hasRegistered) {
      return { hasRegistered: Boolean(hasRegistered), profile: undefined }
    }

    const { userId, points, teamId, tokenId, collectionAddress, isActive } = transformProfileResponse(profileResponse)
    const [team, username, nftRes] = await Promise.all([
      teamId ? getTeam(teamId) : Promise.resolve(null),
      getUsername(address),
      isActive && collectionAddress && tokenId
        ? getNftApi(collectionAddress, tokenId.toString())
        : Promise.resolve(null),
    ])
    let nftToken: NftToken | undefined

    // If the profile is not active the tokenId returns 0, which is still a valid token id
    // so only fetch the nft data if active
    if (nftRes && collectionAddress) {
      nftToken = {
        tokenId: nftRes.tokenId,
        name: nftRes.name,
        collectionName: nftRes.collection.name,
        collectionAddress,
        description: nftRes.description,
        attributes: nftRes.attributes,
        createdAt: nftRes.createdAt,
        updatedAt: nftRes.updatedAt,
        image: {
          original: nftRes.image?.original,
          thumbnail: nftRes.image?.thumbnail,
        },
      }
    } else {
      nftToken = undefined
    }

    const profile = {
      userId,
      points,
      teamId,
      tokenId,
      username,
      collectionAddress,
      isActive,
      nft: nftToken,
      team,
    } as Profile

    return { hasRegistered, profile }
  } catch (e) {
    console.error(e)
    return null
  }
}
