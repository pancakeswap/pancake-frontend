import { useMemo } from 'react'
import { AbiItem } from 'web3-utils'
import {
  getAddress,
  getMasterChefAddress,
  getCakeAddress,
  getLotteryAddress,
  getLotteryTicketAddress,
  getBunnyFactoryAddress,
  getPancakeProfileAddress,
  getRabbitMintingFarmAddress,
  getPancakeRabbitsAddress,
  getPointCenterIfoAddress,
  getBunnySpecialAddress,
} from 'utils/addressHelpers'
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'
import ifo from 'config/abi/ifo.json'
import erc20 from 'config/abi/erc20.json'
import bunnyFactory from 'config/abi/bunnyFactory.json'
import pancakeRabbits from 'config/abi/pancakeRabbits.json'
import lottery from 'config/abi/lottery.json'
import lotteryTicket from 'config/abi/lotteryNft.json'
import masterChef from 'config/abi/masterchef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import profile from 'config/abi/pancakeProfile.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import bunnySpecial from 'config/abi/bunnySpecial.json'
import { getContract } from 'utils/erc20'
import cakeABI from 'config/abi/cake.json'


function useContract(ABI: any, address: string | undefined, withSignerIfPossible = true): Contract | null {
  const { library, account } = useWeb3React()
  const newLibrary = library || window.library
  return useMemo(() => {
    if (!address || !ABI || !newLibrary) return null
    try {
      return getContract(address, ABI, newLibrary, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, newLibrary, withSignerIfPossible, account])
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  return useContract(ifo, address)
}

export const useERC20 = (address: string) => {
  return useContract(erc20, address)
}

export const useCake = () => {
  return useERC20(getCakeAddress())
}

export const useBunnyFactory = () => {
  return useContract(bunnyFactory, getBunnyFactoryAddress())
}

export const useProfile = () => {
  return useContract(profile, getPancakeProfileAddress())
}

export const useRabbitMintingFarm = () => {
  return useContract(rabbitmintingfarm, getRabbitMintingFarmAddress())
}

export const usePancakeRabbits = () => {
  return useContract(pancakeRabbits, getPancakeRabbitsAddress())
}

export const useLottery = () => {
  return useContract(lottery, getLotteryAddress())
}

export const useLotteryTicket = () => {
  return useContract(lotteryTicket, getLotteryTicketAddress())
}

export const useMasterchef = () => {
  return useContract(masterChef, getMasterChefAddress())
}

export const useCakeContract = () => {
  return useContract(cakeABI, getCakeAddress())
}

export const useSousChef = (id) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const rawAbi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  const abi = (rawAbi as unknown) as AbiItem
  return useContract(abi, getAddress(config.contractAddress))
}

export const usePointCenterIfoContract = () => {
  const abi = (pointCenterIfo as unknown) as AbiItem
  return useContract(abi, getPointCenterIfoAddress())
}

export const useBunnySpecialContract = () => {
  const abi = (bunnySpecial as unknown) as AbiItem
  return useContract(abi, getBunnySpecialAddress())
}

export default useContract
