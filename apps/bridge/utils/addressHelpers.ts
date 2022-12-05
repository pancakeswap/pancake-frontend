import { ChainId } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/uikit'
import addresses from 'config/constants/contracts'

export const getAddress = (address: Pool.Address, chainId?: number): string => {
  return chainId && address[chainId] ? address[chainId] : address[ChainId.BSC]
}

export const getMulticallAddress = (chainId?: number) => {
  return getAddress(addresses.multiCall, chainId)
}

export const getAptosBridge = (chainId?: number) => {
  return getAddress(addresses.aptosBridge, chainId)
}
