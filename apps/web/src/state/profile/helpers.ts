import { ChainId } from '@pancakeswap/chains'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { API_PROFILE } from 'config/constants/endpoints'
import { getNftApi } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import { getTeam } from 'state/teams/helpers'
import { Profile } from 'state/types'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

const transformProfileResponse = (profileResponse): Partial<Profile> => {
  const { 0: userId, 1: numberPoints, 2: teamId, 3: collectionAddress, 4: tokenId, 5: isActive } = profileResponse

  return {
    userId: Number(userId),
    points: Number(numberPoints),
    teamId: Number(teamId),
    tokenId: Number(tokenId),
    collectionAddress,
    isActive,
  }
}

export const getUsername = async (address: string): Promise<string> => {
  try {
    const response = await fetch(`${API_PROFILE}/api/users/${address.toLowerCase()}`)

    if (!response.ok) {
      return ''
    }

    const { username = '' } = await response.json()

    return username
  } catch (error) {
    return ''
  }
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
