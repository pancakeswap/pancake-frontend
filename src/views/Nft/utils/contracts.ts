import { AbiItem } from 'web3-utils'
import { getContract } from 'utils/web3'
import { ContractOptions } from 'web3-eth-contract'
import rabbitmintingfarm from 'config/abi/rabbitmintingfarm.json'
import pancakeRabbits from 'config/abi/pancakeRabbits.json'
import { getPancakeRabbitsAddress, getRabbitMintingFarmAddress } from 'utils/addressHelpers'

// TODO: Figure out how to add current account to contracts to write methods can be used

export const getRabbitMintingContract = (contractOptions?: ContractOptions) => {
  const rabbitMintingFarmAbi = (rabbitmintingfarm as unknown) as AbiItem
  return getContract(rabbitMintingFarmAbi, getRabbitMintingFarmAddress(), contractOptions)
}

export const getPancakeRabbitContract = (contractOptions?: ContractOptions) => {
  const pancakeRabbitsAbi = (pancakeRabbits as unknown) as AbiItem
  return getContract(pancakeRabbitsAbi, getPancakeRabbitsAddress(), contractOptions)
}

export default getRabbitMintingContract
