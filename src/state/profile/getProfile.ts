import { getPancakeProfileAddress, getPancakeRabbitsAddress } from 'utils/addressHelpers'
import pancakeProfileAbi from 'config/abi/pancakeProfile.json'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import { Nft } from 'config/constants/types'
import { getContract } from 'utils/erc20'
import { Profile } from 'state/types'
import { getTeam } from 'state/teams/helpers'
import nfts from 'config/constants/nfts'
import { transformProfileResponse } from './helpers'

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

const getUsername = async (address: string): Promise<string> => {
  const profileApi = process.env.REACT_APP_API_PROFILE

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
  const profileContract = getContract(getPancakeProfileAddress(), pancakeProfileAbi, window.library)
  const rabbitContract = getContract(getPancakeRabbitsAddress(), pancakeRabbitsAbi, window.library)

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
      const bunnyId = await rabbitContract.getBunnyId(tokenId)
      nft = nfts.find((nftItem) => nftItem.bunnyId === Number(bunnyId))

      // Save the preview image to local storage for the exchange
      localStorage.setItem(
        `profile_${address}`,
        JSON.stringify({
          username,
          avatar: `https://pancakeswap.finance/images/nfts/${nft.images.sm}`,
        }),
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
