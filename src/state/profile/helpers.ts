import Cookies from 'js-cookie'
import { Profile } from 'state/types'
import { GetUserProfileResponse } from 'utils/types'
import { getProfileContract } from 'utils/contractHelpers'
import { Nft } from 'config/constants/nfts/types'
import { getNftByTokenId } from 'utils/collectibles'
import { getTeam } from 'state/teams/helpers'

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

const transformProfileResponse = (profileResponse: GetUserProfileResponse): Partial<Profile> => {
  const { 0: userId, 1: numberPoints, 2: teamId, 3: nftAddress, 4: tokenId, 5: isActive } = profileResponse

  return {
    userId: userId.toNumber(),
    points: numberPoints.toNumber(),
    teamId: teamId.toNumber(),
    tokenId: tokenId.toNumber(),
    nftAddress,
    isActive,
  }
}

const profileContract = getProfileContract()
const profileApi = process.env.REACT_APP_API_PROFILE

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
    const hasRegistered = await profileContract.hasRegistered(address)

    if (!hasRegistered) {
      return null
    }

    const profileResponse = await profileContract.getUserProfile(address)
    const { tokenId, nftAddress, isActive } = transformProfileResponse(profileResponse)

    let nft = null
    if (isActive) {
      nft = await getNftByTokenId(nftAddress, tokenId)
    }

    return { nft, hasRegistered }
  } catch {
    return { nft: null, hasRegistered: false }
  }
}

export const getProfile = async (address: string): Promise<GetProfileResponse> => {
  try {
    const hasRegistered = await profileContract.hasRegistered(address)

    if (!hasRegistered) {
      return { hasRegistered, profile: null }
    }

    const profileResponse = await profileContract.getUserProfile(address)
    const { userId, points, teamId, tokenId, nftAddress, isActive } = transformProfileResponse(profileResponse)
    const team = await getTeam(teamId)
    const username = await getUsername(address)

    // If the profile is not active the tokenId returns 0, which is still a valid token id
    // so only fetch the nft data if active
    let nft: Nft
    if (isActive) {
      nft = await getNftByTokenId(nftAddress, tokenId)

      // Save the preview image in a cookie so it can be used on the exchange
      Cookies.set(
        `profile_${address}`,
        {
          username,
          avatar: `https://pancakeswap.finance/images/nfts/${nft?.images.sm}`,
        },
        { domain: 'pancakeswap.finance', secure: true, expires: 30 },
      )
    }

    const profile = {
      userId,
      points,
      teamId,
      tokenId,
      username,
      nftAddress,
      isActive,
      nft,
      team,
    } as Profile

    return { hasRegistered, profile }
  } catch (e) {
    console.error(e)
    return null
  }
}
