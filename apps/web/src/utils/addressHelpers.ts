import { ChainId } from '@pancakeswap/chains'
import {
  bCakeFarmBoosterV3Address,
  bCakeFarmBoosterV3VeCakeAddress,
  bCakeFarmWrapperBoosterVeCakeAddress,
} from '@pancakeswap/farms/constants/v3'

import addresses from 'config/constants/contracts'
import { VaultKey } from 'state/types'
import { Address } from 'viem'

export type Addresses = {
  [chainId in ChainId]?: Address
}

export const getAddressFromMap = (address: Addresses, chainId?: number): `0x${string}` => {
  return chainId && address[chainId] ? address[chainId] : address[ChainId.BSC]
}

export const getAddressFromMapNoFallback = (address: Addresses, chainId?: number): `0x${string}` | null => {
  return chainId ? address[chainId] : null
}

export const getMasterChefV2Address = (chainId?: number) => {
  return getAddressFromMapNoFallback(addresses.masterChef, chainId)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multiCall, chainId)
}
export const getLotteryV2Address = () => {
  return getAddressFromMap(addresses.lotteryV2)
}
export const getPancakeProfileAddress = () => {
  return getAddressFromMap(addresses.pancakeProfile)
}
export const getPancakeProfileProxyAddress = (chainId: number) => {
  return getAddressFromMap(addresses.pancakeProfileProxy, chainId)
}

export const getPancakeBunniesAddress = () => {
  return getAddressFromMap(addresses.pancakeBunnies)
}
export const getBunnyFactoryAddress = () => {
  return getAddressFromMap(addresses.bunnyFactory)
}
export const getPredictionsV1Address = () => {
  return getAddressFromMap(addresses.predictionsV1)
}
export const getPointCenterIfoAddress = () => {
  return getAddressFromMap(addresses.pointCenterIfo)
}
export const getTradingCompetitionAddressEaster = () => {
  return getAddressFromMap(addresses.tradingCompetitionEaster)
}
export const getTradingCompetitionAddressFanToken = () => {
  return getAddressFromMap(addresses.tradingCompetitionFanToken)
}

export const getTradingCompetitionAddressMobox = () => {
  return getAddressFromMap(addresses.tradingCompetitionMobox)
}

export const getTradingCompetitionAddressMoD = () => {
  return getAddressFromMap(addresses.tradingCompetitionMoD)
}

export const getVaultPoolAddress = (vaultKey: VaultKey, chainId?: ChainId) => {
  if (!vaultKey) {
    return null
  }
  return getAddressFromMap(addresses[vaultKey], chainId)
}

export const getCakeVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.cakeVault, chainId)
}

export const getCakeFlexibleSideVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.cakeFlexibleSideVault, chainId)
}

export const getFarmAuctionAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.farmAuction, chainId)
}

export const getNftMarketAddress = () => {
  return getAddressFromMap(addresses.nftMarket)
}
export const getNftSaleAddress = () => {
  return getAddressFromMap(addresses.nftSale)
}
export const getPancakeSquadAddress = () => {
  return getAddressFromMap(addresses.pancakeSquad)
}
export const getPotteryDrawAddress = () => {
  return getAddressFromMap(addresses.potteryDraw)
}

export const getZapAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.zap, chainId)
}

export const getBCakeFarmBoosterAddress = () => {
  return getAddressFromMap(addresses.bCakeFarmBooster)
}

export const getBCakeFarmBoosterV3Address = (chainId?: number) => {
  return getAddressFromMap(bCakeFarmBoosterV3Address, chainId)
}

export const getBCakeFarmBoosterVeCakeAddress = (chainId?: number) => {
  return getAddressFromMap(bCakeFarmBoosterV3VeCakeAddress, chainId)
}

export const getBCakeFarmWrapperBoosterVeCakeAddress = (chainId?: number) => {
  return getAddressFromMap(bCakeFarmWrapperBoosterVeCakeAddress, chainId)
}

export const getBCakeFarmBoosterProxyFactoryAddress = () => {
  return getAddressFromMap(addresses.bCakeFarmBoosterProxyFactory)
}

export const getZkSyncAirDropAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.zkSyncAirDrop, chainId)
}

export const getCrossFarmingVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.crossFarmingVault, chainId)
}

export const getCrossFarmingSenderAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.crossFarmingSender, chainId)
}

export const getCrossFarmingReceiverAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.crossFarmingReceiver, chainId)
}

export const getStableSwapNativeHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.stableSwapNativeHelper, chainId)
}

export const getMasterChefV3Address = (chainId?: number) => {
  return getAddressFromMapNoFallback(addresses.masterChefV3, chainId)
}

export const getV3MigratorAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.v3Migrator, chainId)
}

export const getTradingRewardAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.tradingReward, chainId)
}

export const getV3AirdropAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.v3Airdrop, chainId)
}

export const getAffiliateProgramAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.affiliateProgram, chainId)
}

export const getTradingRewardTopTradesAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.tradingRewardTopTrades, chainId)
}

export const getVCakeAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.vCake, chainId)
}

export const getRevenueSharingPoolAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingPool, chainId)
}

export const getAnniversaryAchievementAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.anniversaryAchievement, chainId)
}

export const getFixedStakingAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.fixedStaking, chainId)
}

export const getVeCakeAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.veCake, chainId)
}

export const getPancakeVeSenderV2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.pancakeVeSenderV2, chainId)
}

export const getVeCakeAddressNoFallback = (chainId?: number) => {
  return getAddressFromMapNoFallback(addresses.veCake, chainId)
}

export const getGaugesVotingAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.gaugesVoting, chainId)
}

export const getCalcGaugesVotingAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.gaugesVotingCalc, chainId)
}

export const getRevenueSharingCakePoolAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingCakePool, chainId)
}

export const getRevenueSharingVeCakeAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingVeCake, chainId)
}

export const getRevenueSharingVeCakeAddressNoFallback = (chainId?: number) => {
  return getAddressFromMapNoFallback(addresses.revenueSharingVeCake, chainId)
}

export const getRevenueSharingPoolGatewayAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingPoolGateway, chainId)
}
