import Cookies from 'js-cookie'
import { Profile } from 'state/types'
import { GetUserProfileResponse } from 'utils/types'
import { getProfileContract } from 'utils/contractHelpers'
import { getTeam } from 'state/teams/helpers'

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

const transformProfileResponse = (profileResponse: GetUserProfileResponse): Partial<Profile> => {
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
    const { tokenId, collectionAddress, isActive } = transformProfileResponse(profileResponse)

    const nft = null

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
    const { userId, points, teamId, tokenId, collectionAddress, isActive } = transformProfileResponse(profileResponse)
    const team = await getTeam(teamId)
    const username = await getUsername(address)

    const profile = {
      userId,
      points,
      teamId,
      tokenId,
      username,
      collectionAddress,
      isActive,
      team,
    } as Profile

    return { hasRegistered, profile }
  } catch (e) {
    console.error(e)
    return null
  }
}
