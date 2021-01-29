import { AbiItem } from 'web3-utils'
import { getContract } from 'utils/web3'
import rabbitmintingfarm from 'config/abi/rabbitmintingfarm.json'
import pancakeRabbits from 'config/abi/pancakeRabbits.json'
import { RABBIT_MINTING_FARM_ADDRESS, PANCAKE_RABBITS_ADDRESS } from 'config/constants/nfts'

// TODO: Figure out how to add current account to contracts to write methods can be used

export const getRabbitMintingContract = () => {
  const rabbitMintingFarmAbi = (rabbitmintingfarm as unknown) as AbiItem
  return getContract(rabbitMintingFarmAbi, RABBIT_MINTING_FARM_ADDRESS)
}

export const getPancakeRabbitContract = () => {
  const pancakeRabbitsAbi = (pancakeRabbits as unknown) as AbiItem
  return getContract(pancakeRabbitsAbi, PANCAKE_RABBITS_ADDRESS)
}

export default getRabbitMintingContract
