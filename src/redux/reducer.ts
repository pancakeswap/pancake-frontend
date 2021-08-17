import { BIG_ZERO } from '../utils/bigNumber'
import * as types from './actionTypes'
import tombs from './tombs'
import graves from './graves'
import nfts from './nfts'
import spawningPools from './spawningPools'
import auctions from './auctions'

const defaultState = {
  account: '',
  tombs,
  graves,
  nfts,
  spawningPools,
  bnbPriceUsd: 0,
  auctions,
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
    case types.UPDATE_TOMB_USER_INFO:
      return {
        ...state,
        tombs: state.tombs.map(tomb => tomb.pid === action.payload.pid ? { ...tomb, userInfo: { ...tomb.userInfo, ...action.payload.userInfo } } : tomb),
      }
    case types.UPDATE_TOMB_POOL_INFO:
      return {
        ...state,
        tombs: state.tombs.map(tomb => tomb.pid === action.payload.pid ? { ...tomb, poolInfo: { ...tomb.poolInfo, ...action.payload.poolInfo } } : tomb),
      }
    case types.UPDATE_SPAWNING_POOL_INFO:
      return {
        ...state,
        spawningPools: state.spawningPools.map(spawningPool => spawningPool.id === action.payload.id ? { ...spawningPool, poolInfo: { ...spawningPool.poolInfo, ...action.payload.poolInfo } } : spawningPool),
      }
    case types.UPDATE_SPAWNING_POOL_USER_INFO:
      return {
        ...state,
        spawningPools: state.spawningPools.map(spawningPool => spawningPool.id === action.payload.id ? { ...spawningPool, userInfo: { ...spawningPool.userInfo, ...action.payload.userInfo } } : spawningPool),
      }
    case types.UPDATE_DR_FRANKENSTEIN_ZOMBIE_BALANCE:
      return {
        ...state,
        drFrankenstein: { ...state.drFrankenstein, zombieBalance: action.payload.zombieBalance },
      }
    case types.UPDATE_NFT_TOTAL_SUPPLY:
      return {
        ...state,
        nfts: state.nfts.map(nft => nft.id === action.payload.id ? { ...nft, totalSupply: action.payload.totalSupply } : nft)
      }
    case types.UPDATE_AUCTION_INFO:
      return {
        ...state,
        auctions: state.auctions.map(auction => auction.id === action.payload.id ? { ...auction, auctionInfo: { ...auction.auctionInfo, ...action.payload.auctionInfo } } : auction)
      }
    case types.UPDATE_AUCTION_USER_INFO:
      return {
        ...state,
        auctions: state.auctions.map(auction => auction.id === action.payload.id ? { ...auction, userInfo: { ...auction.userInfo, ...action.payload.userInfo } } : auction)
      }
    default:
      return state
  }
}
