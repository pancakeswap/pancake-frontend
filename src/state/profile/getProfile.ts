import Cookies from 'js-cookie'
import { getProfileContract } from 'utils/contractHelpers'
import { Nft } from 'config/constants/types'
import { getNftByTokenId } from 'utils/collectibles'
import { Profile } from 'state/types'
import { getTeam } from 'state/teams/helpers'
import { transformProfileResponse } from './helpers'

const profileContract = getProfileContract()
const profileApi = process.env.REACT_APP_API_PROFILE

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

const getUsername = async (address: string): Promise<string> => {
  try {
    const response = await fetch(`${profileApi}/api/users/${address}`)

    if (!response.ok) {
      return ''
    }

    const { username = '' } = await response.json()

    return username
  } catch (error) {
    return ''
  }
}

const getProfile = async (address: string): Promise<GetProfileResponse> => {
  try {
    const hasRegistered = (await profileContract.hasRegistered(address)) as boolean

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
  } catch (error) {
    return null
  }
}

export default getProfile
