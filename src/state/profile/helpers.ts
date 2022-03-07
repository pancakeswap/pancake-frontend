import { Profile } from 'state/types'
import { PancakeProfile } from 'config/abi/types/PancakeProfile'
import profileABI from 'config/abi/pancakeProfile.json'
import { getTeam } from 'state/teams/helpers'
import { NftToken } from 'state/nftMarket/types'
import { getNftApi } from 'state/nftMarket/helpers'
import { multicallv2 } from 'utils/multicall'
import { getPancakeProfileAddress } from 'utils/addressHelpers'

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

const transformProfileResponse = (
  profileResponse: Awaited<ReturnType<PancakeProfile['getUserProfile']>>,
): Partial<Profile> => {
  const { 0: userId, 1: numberPoints, 2: teamId, 3: collectionAddress, 4: tokenId, 5: isActive } = profileResponse

  return {
    userId: userId.toNumber(),
    points: numberPoints.toNumber(),
    teamId: teamId.toNumber(),
    tokenId: tokenId.toNumber(),
    collectionAddress,
    isActive,
  }
}

const profileApi = process.env.NEXT_PUBLIC_API_PROFILE

export const getUsername = async (address: string): Promise<string> => {
  try {
    const response = await fetch(`${profileApi}/api/users/${address.toLowerCase()}`)

    if (!response.ok) {
      return ''
    }

    const { username = '' } = await response.json()

    return username
  } catch (error) {
    return ''
  }
}

export const getProfile = async (address: string): Promise<GetProfileResponse> => {
  try {
    const profileCalls = ['hasRegistered', 'getUserProfile'].map((method) => {
      return { address: getPancakeProfileAddress(), name: method, params: [address] }
    })
    const profileCallsResult = await multicallv2(profileABI, profileCalls, { requireSuccess: false })
    const [[hasRegistered], profileResponse] = profileCallsResult
    if (!hasRegistered) {
      return { hasRegistered, profile: null }
    }

    const { userId, points, teamId, tokenId, collectionAddress, isActive } = transformProfileResponse(profileResponse)
    const [team, username, nftRes] = await Promise.all([
      getTeam(teamId),
      getUsername(address),
      isActive ? getNftApi(collectionAddress, tokenId.toString()) : Promise.resolve(null),
    ])
    let nftToken: NftToken

    // If the profile is not active the tokenId returns 0, which is still a valid token id
    // so only fetch the nft data if active
    if (nftRes) {
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
