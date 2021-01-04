import { useEffect, useState } from 'react'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import useWeb3 from 'hooks/useWeb3'
import { contractAddresses, poolsConfig } from 'sushi/lib/constants'
import { PoolCategory } from 'sushi/lib/constants/types'
import ifo from 'sushi/lib/abi/ifo.json'
import erc20 from 'sushi/lib/abi/erc20.json'
import rabbitmintingfarm from 'sushi/lib/abi/rabbitmintingfarm.json'
import pancakeRabbits from 'sushi/lib/abi/pancakeRabbits.json'
import lottery from 'sushi/lib/abi/lottery.json'
import lotteryTicket from 'sushi/lib/abi/lotteryNft.json'
import masterChef from 'sushi/lib/abi/masterchef.json'
import sousChef from 'sushi/lib/abi/sousChef.json'
import sousChefBnb from 'sushi/lib/abi/sousChefBnb.json'

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
  return useContract(ifoAbi, address)
}

export const useERC20 = (address: string) => {
  const erc20Abi = (erc20 as unknown) as AbiItem
  return useContract(erc20Abi, address)
}

export const useCake = () => {
  return useERC20(contractAddresses.sushi[process.env.REACT_APP_CHAIN_ID])
}

export const useRabbitMintingFarm = (address: string) => {
  const rabbitMintingFarmAbi = (rabbitmintingfarm as unknown) as AbiItem
  return useContract(rabbitMintingFarmAbi, address)
}

export const usePancakeRabbits = (address: string) => {
  const pancakeRabbitsAbi = (pancakeRabbits as unknown) as AbiItem
  return useContract(pancakeRabbitsAbi, address)
}

export const useLottery = (address: string) => {
  const abi = (lottery as unknown) as AbiItem
  return useContract(abi, address)
}

export const useLotteryTicker = (address: string) => {
  const abi = (lotteryTicket as unknown) as AbiItem
  return useContract(abi, address)
}

export const useMasterchef = () => {
  const abi = (masterChef as unknown) as AbiItem
  return useContract(abi, contractAddresses.masterChef[process.env.REACT_APP_CHAIN_ID])
}

export const useSousChef = (id) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const rawAbi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  const abi = (rawAbi as unknown) as AbiItem
  return useContract(abi, config.contractAddress[process.env.REACT_APP_CHAIN_ID])
}

export default useContract
