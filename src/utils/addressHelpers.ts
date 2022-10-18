import { ChainId } from '@pancakeswap/sdk'
import addresses from 'config/constants/contracts'
import { Address } from 'config/constants/types'
import { VaultKey } from 'state/types'

export const getAddress = (address: Address, chainId?: number): string => {
  return address[chainId] ? address[chainId] : address[ChainId.BSC]
}

export const getMasterChefAddress = (chainId?: number) => {
  return getAddress(addresses.masterChef, chainId)
}
export const getMasterChefV1Address = () => {
  return getAddress(addresses.masterChefV1)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddress(addresses.multiCall, chainId)
}

export const getVaultPoolAddress = (vaultKey: VaultKey) => {
  if (!vaultKey) {
    return null
  }
  return getAddress(addresses[vaultKey])
}

export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}

export const getCakeFlexibleSideVaultAddress = () => {
  return getAddress(addresses.cakeFlexibleSideVault)
}

export const getBunnySpecialXmasAddress = () => {
  return getAddress(addresses.bunnySpecialXmas)
}

export const getAnniversaryAchievement = () => {
  return getAddress(addresses.AnniversaryAchievement)
}

export const getZapAddress = () => {
  return getAddress(addresses.zap)
}
export const getICakeAddress = () => {
  return getAddress(addresses.iCake)
}

export const getBCakeFarmBoosterAddress = () => {
  return getAddress(addresses.bCakeFarmBooster)
}

export const getBCakeFarmBoosterProxyFactoryAddress = () => {
  return getAddress(addresses.bCakeFarmBoosterProxyFactory)
}

export const getNonBscVaultAddress = (chainId?: number) => {
  return getAddress(addresses.nonBscVault, chainId)
}

export const getCrossFarmingSenderAddress = (chainId?: number) => {
  return getAddress(addresses.crossFarmingSender, chainId)
}

export const getCrossFarmingReceiverAddress = (chainId?: number) => {
  return getAddress(addresses.crossFarmingReceiver, chainId)
}
