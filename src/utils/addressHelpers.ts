import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import tombs from 'views/Tombs/data'
import { Address } from 'config/constants/types'
import { spawningPoolById } from '../redux/get'

export const getAddress = (address: Address): string => {
  const mainNetChainId = 56
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getCakeAddress = () => {
  return getAddress(tokens.cake.address)
}

export const getZombieAddress = () => {
  return getAddress(tokens.zmbe.address)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getDrFrankensteinAddress = () => {
  return getAddress(addresses.drFrankenstein)
}
export const getMausoleumAddress = (version: string) => {
  switch (version) {
    case 'v1':
      return getAddress(addresses.mausoleum)
    case 'v2':
      return getAddress(addresses.mausoleumV2)
    case 'v3':
      return getAddress(addresses.mausoleumV3)
    default:
      return getAddress(addresses.mausoleumV3)
  }
  return getAddress(version === 'v2' ? addresses.mausoleumV2 : addresses.mausoleum)
}
export const getMausoleumV2Address = () => {
  return getAddress(addresses.mausoleumV2)
}
export const getNftOwnershipAddress = () => {
  return getAddress(addresses.nftOwnership)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}

export const getZombieBalanceCheckerAddress = () => {
  return getAddress(addresses.zombieBalanceChecker)
}

export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address)
}
export const getNftConverterAddress = () => {
  return getAddress(addresses.nftConverter)
}
export const getLotteryAddress = () => {
  return getAddress(addresses.lottery)
}
export const getLotteryTicketAddress = () => {
  return getAddress(addresses.lotteryNFT)
}
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile)
}
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getTradingCompetitionAddress = () => {
  return getAddress(addresses.tradingCompetition)
}
export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft)
}
export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}
export const getPredictionsAddress = () => {
  return getAddress(addresses.predictions)
}

export const getSpawningPoolAddress = (id: number) => {
  return getAddress(spawningPoolById(id).address)
}