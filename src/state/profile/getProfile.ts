import { getPancakeProfileAddress, getPancakeRabbitsAddress } from 'utils/addressHelpers'
import pancakeProfileAbi from 'config/abi/pancakeProfile.json'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import { getContract } from 'utils/web3'
import { Profile } from 'state/types'
import { getTeam } from 'state/teams/helpers'
import nfts from 'config/constants/nfts'
import { transformProfileResponse } from './helpers'

const profileContract = getContract(pancakeProfileAbi, getPancakeProfileAddress())
const rabbitContract = getContract(pancakeRabbitsAbi, getPancakeRabbitsAddress())
const profileApi = process.env.REACT_APP_API_PROFILE

const getProfile = async (address: string): Promise<Profile> => {
  try {
    const hasRegistered = await profileContract.methods.hasRegistered(address).call()

    if (!hasRegistered) {
      return null
    }

    const profileResponse = await profileContract.methods.getUserProfile(address).call()
    const { userId, points, teamId, tokenId, nftAddress, isActive } = transformProfileResponse(profileResponse)

    const [bunnyId, team] = await Promise.all([rabbitContract.methods.getBunnyId(tokenId).call(), getTeam(teamId)])
    const nft = nfts.find((nftItem) => nftItem.bunnyId === Number(bunnyId))
    const response = await fetch(`${profileApi}/api/users?address=${address}`)
    const { username = '' } = await response.json()

    // Save the preview image to local storage for the exchange
    localStorage.setItem(
      `profile_${address}`,
      JSON.stringify({
        username,
        avatar: `https://pancakeswap.finance/images/nfts/${nft.images.sm}`,
      }),
    )

    return {
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
  } catch (error) {
    return null
  }
}

export default getProfile
