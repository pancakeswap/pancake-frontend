import { useEffect, useState } from 'react'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import useWeb3 from 'hooks/rework/useWeb3'
import ifo from 'sushi/lib/abi/ifo.json'
import erc20 from 'sushi/lib/abi/erc20.json'
import rabbitmintingfarm from 'sushi/lib/abi/rabbitmintingfarm.json'
import pancakeRabbits from 'sushi/lib/abi/pancakeRabbits.json'

const useContract = (abi: AbiItem, address: string, contractOptions?: ContractOptions) => {
  const web3 = useWeb3()
  const [contract, setContract] = useState(new web3.eth.Contract(abi, address, contractOptions))

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address, contractOptions))
  }, [abi, address, contractOptions, web3])

  return contract
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const ifoAbi = (ifo as unknown) as AbiItem
  const contract = useContract(ifoAbi, address)
  return contract
}

export const useERC20 = (address: string) => {
  const erc20Abi = (erc20 as unknown) as AbiItem
  const contract = useContract(erc20Abi, address)
  return contract
}

export const useRabbitMintingFarm = (address: string) => {
  const rabbitMintingFarmAbi = (rabbitmintingfarm as unknown) as AbiItem
  const contract = useContract(rabbitMintingFarmAbi, address)
  return contract
}

export const usePancakeRabbits = (address: string) => {
  const pancakeRabbitsAbi = (pancakeRabbits as unknown) as AbiItem
  const contract = useContract(pancakeRabbitsAbi, address)
  return contract
}

export default useContract
