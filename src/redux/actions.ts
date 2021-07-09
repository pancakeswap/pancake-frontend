import { BigNumber } from 'bignumber.js'
import * as actions from './actionTypes'
import { UPDATE_DR_FRANKENSTEIN_ZOMBIE_BALANCE } from './actionTypes'

export const updateAccount = (account: string) => ({
  type: actions.UPDATE_ACCOUNT,
  payload: {
    account,
  },
})

export const updateZombieAllowance = (allowance: BigNumber) => ({
  type: actions.UPDATE_ZOMBIE_ALLOWANCE,
  payload: {
    allowance,
  },
})

export const updateZombieTotalSupply = (totalSupply: BigNumber) => ({
  type: actions.UPDATE_ZOMBIE_TOTAL_SUPPLY,
  payload: {
    totalSupply,
  },
})

export const updateDrFrankensteinZombieBalance = (zombieBalance: BigNumber) => ({
  type: actions.UPDATE_DR_FRANKENSTEIN_ZOMBIE_BALANCE,
  payload: {
    zombieBalance,
  },
})

export const updateZombieBalance = (balance: BigNumber) => ({
  type: actions.UPDATE_ZOMBIE_BALANCE,
  payload: {
    balance,
  },
})

export const updateZombiePriceBnb = (zombiePriceBnb: BigNumber) => ({
  type: actions.UPDATE_ZOMBIE_PRICE_BNB,
  payload: {
    zombiePriceBnb
  },
})

export const updateBnbPriceUsd = (bnbPriceUsd: number) => ({
  type: actions.UPDATE_BNB_PRICE_USD,
  payload: {
    bnbPriceUsd
  },
})

export const updateTomb = (pid: number, tombResult) => ({ // todo add tomb type restriction
  type: actions.UPDATE_TOMB,
  payload: {
    pid,
    tombResult
  },
})