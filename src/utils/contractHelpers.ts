import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/web3'
import profileABI from 'config/abi/pancakeProfile.json'

export const getProfileContract = () => {
  return getContract(profileABI, getPancakeProfileAddress())
}

export default null
