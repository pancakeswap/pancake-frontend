import type { Signer } from '@ethersproject/abstract-signer'
import { Contract } from '@ethersproject/contracts'
import type { Provider } from '@ethersproject/providers'
import { CAKE } from '@pancakeswap/tokens'
import poolsConfig from 'config/constants/pools'
import { PoolCategory } from 'config/constants/types'
import { provider } from 'utils/wagmi'

// Addresses
import {
  getAddress, getAnniversaryAchievement, getBCakeFarmBoosterAddress,
  getBCakeFarmBoosterProxyFactoryAddress, getBunnySpecialXmasAddress, getCakeFlexibleSideVaultAddress, getCakeVaultAddress, getCrossFarmingReceiverAddress, getCrossFarmingSenderAddress, getICakeAddress, getMasterChefAddress,
  getMasterChefV1Address, getNonBscVaultAddress
} from 'utils/addressHelpers'

// ABI
import anniversaryAchievementAbi from 'config/abi/anniversaryAchievement.json'
import bCakeFarmBoosterAbi from 'config/abi/bCakeFarmBooster.json'
import bCakeFarmBoosterProxyFactoryAbi from 'config/abi/bCakeFarmBoosterProxyFactory.json'
import bCakeProxyAbi from 'config/abi/bCakeProxy.json'
import bunnySpecialXmasAbi from 'config/abi/bunnySpecialXmas.json'
import cakeAbi from 'config/abi/cake.json'
import cakeFlexibleSideVaultV2Abi from 'config/abi/cakeFlexibleSideVaultV2.json'
import cakeVaultV2Abi from 'config/abi/cakeVaultV2.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import crossFarmingProxyAbi from 'config/abi/crossFarmingProxy.json'
import crossFarmingReceiverAbi from 'config/abi/crossFarmingReceiver.json'
import crossFarmingSenderAbi from 'config/abi/crossFarmingSender.json'
import bep20Abi from 'config/abi/erc20.json'
import iCakeAbi from 'config/abi/iCake.json'
import masterChef from 'config/abi/masterchef.json'
import masterChefV1 from 'config/abi/masterchefV1.json'
import nonBscVault from 'config/abi/nonBscVault.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'

// Types
import { ChainId } from '@pancakeswap/sdk'
import type {
  AnniversaryAchievement, BCakeFarmBooster,
  BCakeFarmBoosterProxyFactory,
  BCakeProxy, Cake, CakeFlexibleSideVaultV2, CakeVaultV2, ChainlinkOracle, CrossFarmingProxy, CrossFarmingReceiver, CrossFarmingSender, Erc20, ICake, Masterchef,
  MasterchefV1, NonBscVault, SousChef
} from 'config/abi/types'

export const getContract = ({
  abi,
  address,
  chainId = ChainId.BSC,
  signer,
}: {
  abi: any
  address: string
  chainId?: ChainId
  signer?: Signer | Provider
}) => {
  const signerOrProvider = signer ?? provider({ chainId })
  return new Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: bep20Abi, address, signer }) as Erc20
}

export const getSouschefContract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract({ abi, address: getAddress(config.contractAddress), signer }) as SousChef
}

export const getCakeContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: cakeAbi,
    address: chainId ? CAKE[chainId].address : CAKE[ChainId.BSC].address,
    signer,
  }) as Cake
}

export const getMasterchefContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: masterChef, address: getMasterChefAddress(chainId), signer }) as Masterchef
}
export const getMasterchefV1Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: masterChefV1, address: getMasterChefV1Address(), signer }) as MasterchefV1
}

export const getCakeVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: cakeVaultV2Abi, address: getCakeVaultAddress(), signer }) as CakeVaultV2
}

export const getCakeFlexibleSideVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: cakeFlexibleSideVaultV2Abi,
    address: getCakeFlexibleSideVaultAddress(),
    signer,
  }) as CakeFlexibleSideVaultV2
}

export const getChainlinkOracleContract = (address: string, signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: chainlinkOracleAbi, address, signer, chainId }) as ChainlinkOracle
}

export const getBunnySpecialXmasContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bunnySpecialXmasAbi, address: getBunnySpecialXmasAddress(), signer })
}

export const getAnniversaryAchievementContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: anniversaryAchievementAbi,
    address: getAnniversaryAchievement(),
    signer,
  }) as AnniversaryAchievement
}

export const getIfoCreditAddressContract = (signer?: Signer | Provider) => {
  return getContract({ abi: iCakeAbi, address: getICakeAddress(), signer }) as ICake
}

export const getBCakeFarmBoosterContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bCakeFarmBoosterAbi, address: getBCakeFarmBoosterAddress(), signer }) as BCakeFarmBooster
}

export const getBCakeFarmBoosterProxyFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bCakeFarmBoosterProxyFactoryAbi,
    address: getBCakeFarmBoosterProxyFactoryAddress(),
    signer,
  }) as BCakeFarmBoosterProxyFactory
}

export const getBCakeProxyContract = (proxyContractAddress: string, signer?: Signer | Provider) => {
  return getContract({ abi: bCakeProxyAbi, address: proxyContractAddress, signer }) as BCakeProxy
}

export const getNonBscVaultContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: nonBscVault, address: getNonBscVaultAddress(chainId), chainId, signer }) as NonBscVault
}

export const getCrossFarmingSenderContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: crossFarmingSenderAbi,
    address: getCrossFarmingSenderAddress(chainId),
    chainId,
    signer,
  }) as CrossFarmingSender
}

export const getCrossFarmingReceiverContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: crossFarmingReceiverAbi,
    address: getCrossFarmingReceiverAddress(chainId),
    chainId,
    signer,
  }) as CrossFarmingReceiver
}

export const getCrossFarmingProxyContract = (
  proxyContractAddress: string,
  signer?: Signer | Provider,
  chainId?: number,
) => {
  return getContract({ abi: crossFarmingProxyAbi, address: proxyContractAddress, chainId, signer }) as CrossFarmingProxy
}
