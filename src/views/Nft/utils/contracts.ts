import { AbiItem } from 'web3-utils'
import { getContract } from 'utils/web3'
import rabbitmintingfarm from 'sushi/lib/abi/rabbitmintingfarm.json'
import pancakeRabbits from 'sushi/lib/abi/pancakeRabbits.json'

export const RABBIT_MINTING_FARM_ADDRESS = '0xE4E3AFeDA68C740D49273b35d406AE1582d6b49A'
export const PANCAKE_RABBITS_ADDRESS = '0xA286716A5eB2d3F890E0c917Dc7c2e23d3BA70a5'

export const getRabbitMintingContract = () => {
  const rabbitMintingFarmAbi = (rabbitmintingfarm as unknown) as AbiItem
  return getContract(rabbitMintingFarmAbi, RABBIT_MINTING_FARM_ADDRESS)
}

export const getPancakeRabbitContract = () => {
  const pancakeRabbitsAbi = (pancakeRabbits as unknown) as AbiItem
  return getContract(pancakeRabbitsAbi, PANCAKE_RABBITS_ADDRESS)
}

export default getRabbitMintingContract
