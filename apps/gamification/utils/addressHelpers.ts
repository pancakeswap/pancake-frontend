import { ChainId } from '@pancakeswap/chains'
import addresses from 'config/constants/contracts'
import { Address } from 'viem'

export type Addresses = {
  [chainId in ChainId]?: Address
}

export const getAddressFromMap = (address: Addresses, chainId?: number): `0x${string}` => {
  return chainId && address[chainId] ? address[chainId] : address[ChainId.BSC]
}

export const getPancakeProfileAddress = () => {
  return getAddressFromMap(addresses.pancakeProfile)
}
