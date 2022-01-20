import Cookies from 'js-cookie'
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

/**
 * Intended to be used for getting a profile avatar
 */
export const getProfileAvatar = async (address: string) => {
  try {
    const profileCalls = ['hasRegistered', 'getUserProfile'].map((method) => {
      return { address: getPancakeProfileAddress(), name: method, params: [address] }
    })
    const profileCallsResult = await multicallv2(profileABI, profileCalls, { requireSuccess: false })
    const [[hasRegistered], profileResponse] = profileCallsResult

    if (!hasRegistered) {
      return null
    }

    const { tokenId, collectionAddress, isActive } = transformProfileResponse(profileResponse)

    let nft = null
    if (isActive) {
      const apiRes = await getNftApi(collectionAddress, tokenId.toString())

      nft = {
        tokenId: apiRes.tokenId,
        name: apiRes.name,
        collectionName: apiRes.collection.name,
        collectionAddress,
        description: apiRes.description,
        attributes: apiRes.attributes,
        createdAt: apiRes.createdAt,
        updatedAt: apiRes.updatedAt,
        image: {
          original: apiRes.image?.original,
          thumbnail: apiRes.image?.thumbnail,
        },
      }
    }

    return { nft, hasRegistered }
  } catch {
    return { nft: null, hasRegistered: false }
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
    const team = await getTeam(teamId)
    const username = await getUsername(address)
    let nftToken: NftToken

    // If the profile is not active the tokenId returns 0, which is still a valid token id
    // so only fetch the nft data if active
    if (isActive) {
      const apiRes = await getNftApi(collectionAddress, tokenId.toString())
      if (apiRes) {
        nftToken = {
          tokenId: apiRes.tokenId,
          name: apiRes.name,
          collectionName: apiRes.collection.name,
          collectionAddress,
          description: apiRes.description,
          attributes: apiRes.attributes,
          createdAt: apiRes.createdAt,
          updatedAt: apiRes.updatedAt,
          image: {
            original: apiRes.image?.original,
            thumbnail: apiRes.image?.thumbnail,
          },
        }
        // Save the preview image in a cookie so it can be used on the exchange
        Cookies.set(
          `profile_${address}`,
          {
            username,
            avatar: `${nftToken.image.thumbnail}`,
          },
          { domain: 'pancakeswap.finance', secure: true, expires: 30 },
        )
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
