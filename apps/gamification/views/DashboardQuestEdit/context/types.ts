import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/sdk'
import { TaskType } from 'views/DashboardQuestEdit/type'

export interface TaskBaseConfig {
  sid: string
  type: TaskType
}

export interface TaskSwapConfig extends TaskBaseConfig {
  type: TaskType.MAKE_A_SWAP
  minAmount: string
  currency: Currency
}

export interface TaskLotteryConfig extends TaskBaseConfig {
  type: TaskType.PARTICIPATE_LOTTERY
  minAmount: string
  fromRound: string
  toRound: string
}

export interface TaskLiquidityConfig extends TaskBaseConfig {
  type: TaskType.ADD_LIQUIDITY
  network: ChainId
  minAmount: string
  lpAddress: string
}

export interface TaskSocialConfig extends TaskBaseConfig {
  type:
    | TaskType.X_LINK_POST
    | TaskType.X_FOLLOW_ACCOUNT
    | TaskType.X_REPOST_POST
    | TaskType.TELEGRAM_JOIN_GROUP
    | TaskType.DISCORD_JOIN_SERVICE
    | TaskType.YOUTUBE_SUBSCRIBE
    | TaskType.IG_LIKE_POST
    | TaskType.IG_COMMENT_POST
    | TaskType.IG_FOLLOW_ACCOUNT
  socialLink: string
}

export type TaskConfigType = TaskSwapConfig | TaskLotteryConfig | TaskLiquidityConfig | TaskSocialConfig
