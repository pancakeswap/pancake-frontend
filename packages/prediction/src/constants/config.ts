import { BSC_BLOCK_TIME } from '@pancakeswap/pools'
import { LeaderboardMinRoundsPlatedType, PredictionSupportedSymbol } from '../type'

export const REWARD_RATE = 0.97

// Estimated number of seconds it takes to submit a transaction, assuming 3 blocks
export const TRANSACTION_BUFFER_BLOCKS = 3

export const PAST_ROUND_COUNT = 5
export const FUTURE_ROUND_COUNT = 2

export const ROUNDS_PER_PAGE = 200

export const LEADERBOARD_MIN_ROUNDS_PLAYED = {
  [PredictionSupportedSymbol.BNB]: 10,
  [PredictionSupportedSymbol.CAKE]: 10,
  [PredictionSupportedSymbol.ETH]: 0,
  [PredictionSupportedSymbol.WBTC]: 0,
} as const satisfies LeaderboardMinRoundsPlatedType<PredictionSupportedSymbol>
