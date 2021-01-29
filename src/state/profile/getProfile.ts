import { getPancakeProfileAddress, getPancakeRabbitsAddress } from 'utils/addressHelpers'
import pancakeProfileAbi from 'config/abi/pancakeProfile.json'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import { getContract } from 'utils/web3'
import { IpfsData, Profile } from 'state/types'
import nfts from 'config/constants/nfts'
import { Nft } from 'config/constants/types'
import makeBatchRequest from 'utils/makeBatchRequest'
import { transformProfileResponse, transformTeamResponse, TeamResponse } from './helpers'

const profileContract = getContract(pancakeProfileAbi, getPancakeProfileAddress())
const rabbitContract = getContract(pancakeRabbitsAbi, getPancakeRabbitsAddress())
const profileApi = process.env.REACT_APP_API_PROFILE

/**
 * Remove "ipfs://" prefix
 * e.g. ipfs://QmRcg86epUhTqSXmchjHRzJsXynmLkJqpZCxten4LdX578/flipper.json
 */
const stripIpfsPrefix = (uri: string) => uri.substr(6)

const getProfile = async (address: string): Promise<Profile> => {
  try {
    const hasRegistered = await profileContract.methods.hasRegistered(address).call()

    if (!hasRegistered) {
      return null
    }

    const profileResponse = await profileContract.methods.getUserProfile(address).call()
    const { userId, numberPoints, teamId, tokenId, nftAddress, isActive } = transformProfileResponse(profileResponse)
    const [tokenURI, teamProfileResponse] = await makeBatchRequest([
      rabbitContract.methods.tokenURI(tokenId).call,
      profileContract.methods.getTeamProfile(teamId).call,
    ])
    const team = transformTeamResponse(teamProfileResponse as TeamResponse)

    // Get NFT data
    const ipfsLocation = stripIpfsPrefix(tokenURI as string)
    // TODO: move this location to a config
    const ipfsResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsLocation}`)
    const ipfs: IpfsData = await ipfsResponse.json()
    const nft: Nft = nfts.find((nftItem) => nftItem.bunnyId === Number(ipfs.attributes.bunnyId))

    const response = await fetch(`${profileApi}/api/users?address=${address}`)
    const { username = '' } = await response.json()

    return {
      userId,
      numberPoints,
      teamId,
      tokenId,
      username,
      nftAddress,
      isActive,
      ipfs,
      nft,
      team,
    } as Profile
  } catch (error) {
    return null
  }
}

export default getProfile
