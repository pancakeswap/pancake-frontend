import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import tombs from 'views/Tombs/data'
import { Address } from 'config/constants/types'
import spawningPools from '../redux/spawningPools'

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
export const getMausoleumAddress = () => {
  return getAddress(addresses.mausoleum)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
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
  return getAddress(spawningPools.find(sp => sp.id === id).address)
}