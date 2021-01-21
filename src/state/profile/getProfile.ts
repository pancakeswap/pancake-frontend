import { getPancakeProfileAddress } from 'utils/addressHelpers'
import abi from 'config/abi/pancakeProfile.json'
import { getContract } from 'utils/web3'
import { Profile } from 'state/types'

const pancakeProfileAddress = getPancakeProfileAddress()
const contract = getContract(abi, pancakeProfileAddress)

const getProfile = async (address: string): Promise<Profile> => {
  try {
    const hasRegistered = await contract.methods.hasRegistered(address).call()

    if (!hasRegistered) {
      return null
    }

    const profile = await contract.methods.getUserProfile(address).call()
    return profile
  } catch (error) {
    return null
  }
}

export default getProfile
