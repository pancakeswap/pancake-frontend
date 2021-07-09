import { BigNumber } from 'bignumber.js'
import store from './store'

export const account = (): string => {
  return store.getState().account
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


// store lpreserves

// have func where u pass bnb pool and it returns price