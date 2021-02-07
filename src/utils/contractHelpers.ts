import {
  getPancakeProfileAddress,
  getPancakeRabbitsAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
} from 'utils/addressHelpers'
import { getContract } from 'utils/erc20'
import profileABI from 'config/abi/pancakeProfile.json'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'

export const getProfileContract = () => {
  return getContract(getPancakeProfileAddress(), profileABI)
}

export const getPancakeRabbitContract = () => {
  return getContract(getPancakeRabbitsAddress(), pancakeRabbitsAbi)
}

export const getBunnyFactoryContract = () => {
  return getContract(getBunnyFactoryAddress(), bunnyFactoryAbi)
}

export const getBunnySpecialContract = () => {
  return getContract(getBunnySpecialAddress(), bunnySpecialAbi)
}

export default null
