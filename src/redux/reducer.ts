import { BIG_ZERO } from '../utils/bigNumber'
import * as types from './actionTypes'
import tombs from './tombs'
import graves from './graves'

const defaultState = {
  account: '',
  tombs,
  graves,
  bnbPriceUsd: 0,
  zombie: {
    allowance: BIG_ZERO,
    totalSupply: BIG_ZERO,
    balance: BIG_ZERO,
    priceBnb: BIG_ZERO,
  },
  drFrankenstein: {
    zombieBalance: BIG_ZERO,
  },
}

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case types.UPDATE_ACCOUNT:
      return {
        ...state,
        account: action.payload.account,
      }
    case types.UPDATE_ZOMBIE_ALLOWANCE:
      return {
        ...state,
        zombie: { ...state.zombie, allowance: action.payload.allowance },
      }
    case types.UPDATE_ZOMBIE_TOTAL_SUPPLY:
      return {
        ...state,
        zombie: { ...state.zombie, totalSupply: action.payload.totalSupply },
      }
    case types.UPDATE_ZOMBIE_BALANCE:
      return {
        ...state,
        zombie: { ...state.zombie, balance: action.payload.balance },
      }
    case types.UPDATE_ZOMBIE_PRICE_BNB:
      return {
        ...state,
        zombie: { ...state.zombie, priceBnb: action.payload.zombiePriceBnb },
      }
    case types.UPDATE_BNB_PRICE_USD:
      return {
        ...state,
        bnbPriceUsd: action.payload.bnbPriceUsd,
      }
    case types.UPDATE_TOMB:
      return {
        ...state,
        tombs: state.tombs.map(tomb => tomb.pid === action.payload.pid ? { ...tomb, result: { ...tomb.result, ...action.payload.tombResult } } : tomb),
      }
    case types.UPDATE_GRAVE_POOL_INFO:
      return {
        ...state,
        graves: state.graves.map(grave => grave.pid === action.payload.pid ? { ...grave, poolInfo: { ...grave.poolInfo, ...action.payload.poolInfo } } : grave),
      }
    case types.UPDATE_GRAVE_USER_INFO:
      return {
        ...state,
        graves: state.graves.map(grave => grave.pid === action.payload.pid ? { ...grave, userInfo: { ...grave.userInfo, ...action.payload.userInfo } } : grave),
      }
    case types.UPDATE_DR_FRANKENSTEIN_ZOMBIE_BALANCE:
      return {
        ...state,
        drFrankenstein: { ...state.drFrankenstein, zombieBalance: action.payload.zombieBalance },
      }
    default:
      return state
  }
}
