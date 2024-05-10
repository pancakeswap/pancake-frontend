import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'

export enum TaskType {
  MAKE_A_SWAP = 'MAKE_A_SWAP',
  ADD_LIQUIDITY = 'ADD_LIQUIDITY',
  PARTICIPATE_LOTTERY = 'PARTICIPATE_LOTTERY',
  MAKE_PREDICTION = 'MAKE_PREDICTION',
  // Social
  X_LINK_POST = 'X_LINK_POST',
  X_FOLLOW_ACCOUNT = 'X_FOLLOW_ACCOUNT',
  X_REPOST_POST = 'X_REPOST_POST',
  TELEGRAM_JOIN_GROUP = 'TELEGRAM_JOIN_GROUP',
  DISCORD_JOIN_SERVICE = 'DISCORD_JOIN_SERVICE',
  YOUTUBE_SUBSCRIBE = 'YOUTUBE_SUBSCRIBE',
  IG_LIKE_POST = 'IG_LIKE_POST',
  IG_COMMENT_POST = 'IG_COMMENT_POST',
  IG_FOLLOW_ACCOUNT = 'IG_FOLLOW_ACCOUNT',
}

// Swap
// - currency
// - minAmount

// Lottery
// - minAmount
// - fromRound,
// - toRound

// Add liquidity
// - network
// - lp address
// - minAmount

// - Social
// - social link

export interface Task {
  type: TaskType
  minAmount?: 0
  fromRound?: 0
  toRound?: 0
  networkId?: ChainId
  lpAddress?: Address
  socialLink?: string
}
