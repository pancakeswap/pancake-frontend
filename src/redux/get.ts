import { BigNumber } from 'bignumber.js'
import store from './store'
import { Grave, PoolInfo, UserInfo } from './types'

export const account = (): string => {
  return store.getState().account
}

export const zombieAllowance = (): BigNumber => {
  return store.getState().zombie.allowance
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

export const tombByPid = (pid: number): any => {
  return store.getState().tombs.find(t => t.pid === pid)
}

export const zmbeBnbTomb = (): any => {
  return store.getState().tombs[0]
}

export const graveByPid = (pid: number): any => {
  return store.getState().graves.find(g => g.pid === pid)
}

export const graves = (): Grave[] => {
  return store.getState().graves
}

export const graveUserInfo = (pid: number): UserInfo => {
  return store.getState().graves[pid].userInfo
}

export const grave = (pid: number): Grave => {
  return store.getState().graves.find(g => g.pid === pid)
}

// store lpreserves

// have func where u pass bnb pool and it returns price