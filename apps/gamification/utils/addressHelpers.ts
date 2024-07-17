import { ChainId } from '@pancakeswap/chains'
import addresses from 'config/constants/contracts'
import { Address } from 'viem'

export type Addresses = {
  [chainId in ChainId]?: Address
}

export const getAddressFromMap = (address: Addresses, chainId?: number): `0x${string}` => {
  return (chainId && address[chainId as ChainId] ? address[chainId as ChainId] : address[ChainId.BSC]) ?? '0x'
}

export const getPancakeProfileAddress = () => {
  return getAddressFromMap(addresses.pancakeProfile)
}

export const getBunnyFactoryAddress = () => {
  return getAddressFromMap(addresses.bunnyFactory)
}

export const getPancakeBunniesAddress = () => {
  return getAddressFromMap(addresses.pancakeBunnies)
}

export const getNftMarketAddress = () => {
  return getAddressFromMap(addresses.nftMarket)
}

export const getPointCenterIfoAddress = () => {
  return getAddressFromMap(addresses.pointCenterIfo)
}

export const getMulticallAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multiCall, chainId)
}

export const getQuestRewardAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.questReward, chainId)
}
