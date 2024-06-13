import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/sdk'
import { TaskType } from 'views/DashboardQuestEdit/type'

export interface TaskBaseConfig {
  sid: string
  title: string
  description: string
  taskType: TaskType
  isOptional: boolean
  isCompleted: boolean
}

export interface TaskSwapConfig extends TaskBaseConfig {
  taskType: TaskType.MAKE_A_SWAP
  minAmount: string
  currency: Currency
}

export interface TaskHoldTokenConfig extends TaskBaseConfig {
  taskType: TaskType.HOLD_A_TOKEN
  minAmount: string
  currency: Currency
}

export interface TaskLotteryConfig extends TaskBaseConfig {
  taskType: TaskType.PARTICIPATE_LOTTERY
  minAmount: string
  fromRound: string
  toRound: string
}

export interface TaskLiquidityConfig extends TaskBaseConfig {
  taskType: TaskType.ADD_LIQUIDITY
  network: ChainId
  minAmount: string
  lpAddress: string
}

export interface TaskSocialConfig extends TaskBaseConfig {
  taskType:
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
  accountId: string
}

export interface TaskBlogPostConfig extends TaskBaseConfig {
  taskType: TaskType.ADD_BLOG_POST
  blogUrl: string
}

export type TaskConfigType =
  | TaskSwapConfig
  | TaskHoldTokenConfig
  | TaskLotteryConfig
  | TaskLiquidityConfig
  | TaskSocialConfig
  | TaskBlogPostConfig
