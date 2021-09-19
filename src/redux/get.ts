import { BigNumber } from 'bignumber.js'
import axios from 'axios'
import store from './store'
import { Grave, Tomb, SpawningPool, UserInfo, Auction } from './types'
import { BIG_ZERO } from '../utils/bigNumber'
import { getBalanceAmount } from '../utils/formatBalance'

export const account = (): string => {
  return store.getState().account
}

export const zombieAllowance = (): BigNumber => {
  return store.getState().zombie.allowance
}

export const zombieBalance = (): BigNumber => {
  return store.getState().zombie.balance
}

export const zombieTotalSupply = (): BigNumber => {
  return store.getState().zombie.totalSupply
}

export const zombiePriceBnb = (): BigNumber => {
  return store.getState().zombie.priceBnb
}

export const bnbPriceUsd = (): number => {
  return store.getState().bnbPriceUsd
}

export const zombiePriceUsd = (): number => {
  return (zombiePriceBnb().times(bnbPriceUsd())).toNumber()
}

export const drFrankensteinZombieBalance = (): BigNumber => {
  return store.getState().drFrankenstein.zombieBalance
}

export const totalAllocPoint = (): BigNumber => {
  return store.getState().drFrankenstein.totalAllocPoint
}

export const tombByPid = (pid: number): Tomb => {
  return store.getState().tombs.find(t => t.pid === pid)
}

export const coingeckoPrice = (id: string) => {
  return axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`)
}

export const zmbeBnbTomb = (): Tomb => {
  return tombByPid(11)
}

export const graveByPid = (pid: number): Grave => {
  return store.getState().graves.find(g => g.pid === pid)
}

export const graves = (): Grave[] => {
  return store.getState().graves
}

export const graveUserInfo = (pid: number): UserInfo => {
  return store.getState().graves[pid].userInfo
}

export const spawningPools = (): SpawningPool[] => {
  return store.getState().spawningPools
}

export const spawningPoolById = (id: number): SpawningPool => {
  return store.getState().spawningPools.find(p => p.id === id)
}

export const grave = (pid: number): Grave => {
  return store.getState().graves.find(g => g.pid === pid)
}

export const tombs = (): Tomb[] => {
  return store.getState().tombs
}

export const auctions = (): Auction[] => {
  return store.getState().auctions
}

export const auctionById = (id: number): Auction => {
  return auctions().find(a => a.id === id)
}

export const nfts = () => {
  return store.getState().nfts
}

export const nftByName = (name: string) => {
  return nfts().find(n => n.name === name)
}

export const nftById = (id: number) => {
  return nfts().find(n => n.id === id)
}

export const nftTotalSupply = (): BigNumber => {
  let totalSupply = BIG_ZERO
  nfts().forEach(nft => {
    totalSupply = totalSupply.plus(nft.totalSupply)
  })
  return totalSupply
}

// store lpreserves
export const zmbeBnbLpPriceBnb = () => {
  const { poolInfo: { reserves, lpTotalSupply }} = zmbeBnbTomb()
  const reservesBnb = [new BigNumber(reserves[0]).times(zombiePriceBnb()), getBalanceAmount(reserves[1])]
  const bnbLpTokenPrice = reservesBnb[0].plus(reservesBnb[1]).div(lpTotalSupply)
  return bnbLpTokenPrice
}

export const zmbePerZmbeBnbLp = () => {
  const { poolInfo: {reserves, lpTotalSupply } } = zmbeBnbTomb()
  return reserves[0].div(lpTotalSupply)
}
