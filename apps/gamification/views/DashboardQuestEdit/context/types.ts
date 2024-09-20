import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { CompletionStatus, RewardType, TaskType } from 'views/DashboardQuestEdit/type'

export interface StateType {
  id: string
  orgId: string
  chainId: ChainId
  completionStatus: CompletionStatus
  title: string
  description: string
  startDate: null | Date
  startTime: null | Date
  endDate: null | Date
  endTime: null | Date
  reward: undefined | QuestRewardType
  rewardSCAddress: string
  ownerAddress: string
  needAddReward: boolean

  // For api return
  startDateTime: number
  endDateTime: number
  numberOfParticipants: number
}

export interface TaskBaseConfig {
  id?: string // Id from BE
  sid: string // Sid is for FE easy to edit / delete task
  title: string
  description: string
  taskType: TaskType
  isOptional: boolean
  orderNumber: number
}

export interface TaskSwapConfig extends TaskBaseConfig {
  taskType: TaskType.MAKE_A_SWAP
  minAmount: string
  network: ChainId
  tokenAddress: Address
}

export interface TaskHoldTokenConfig extends TaskBaseConfig {
  taskType: TaskType.HOLD_A_TOKEN
  minAmount: string
  network: ChainId
  tokenAddress: Address
  minHoldDays: number
}

export interface TaskLotteryConfig extends TaskBaseConfig {
  taskType: TaskType.PARTICIPATE_LOTTERY
  minAmount: number
  fromRound: number
  toRound: number
}

export interface TaskLiquidityConfig extends TaskBaseConfig {
  taskType: TaskType.ADD_LIQUIDITY
  network: ChainId
  minAmount: string
  lpAddress: string
  lpAddressLink: string
  feeTier: string
  stakePeriodInDays: number
}

export interface TaskSocialConfig extends TaskBaseConfig {
  taskType:
    | TaskType.X_LIKE_POST
    | TaskType.X_FOLLOW_ACCOUNT
    | TaskType.X_REPOST_POST
    | TaskType.TELEGRAM_JOIN_GROUP
    | TaskType.DISCORD_JOIN_SERVER
    | TaskType.YOUTUBE_SUBSCRIBE
    | TaskType.IG_LIKE_POST
    | TaskType.IG_COMMENT_POST
    | TaskType.IG_FOLLOW_ACCOUNT
  accountId: string
  socialLink: string
}

export interface TaskBlogPostConfig extends TaskBaseConfig {
  taskType: TaskType.VISIT_BLOG_POST
  blogUrl: string
}

export interface TaskMakePredictionConfig extends TaskBaseConfig {
  taskType: TaskType.MAKE_A_PREDICTION
  link: string
  network: ChainId
}

export type TaskConfigType =
  | TaskSwapConfig
  | TaskHoldTokenConfig
  | TaskLotteryConfig
  | TaskLiquidityConfig
  | TaskSocialConfig
  | TaskBlogPostConfig
  | TaskMakePredictionConfig

export interface QuestRewardType {
  title: string
  description: string
  rewardType: RewardType
  currency: {
    address: Address
    network: ChainId
  }
  amountOfWinners: number
  totalRewardAmount: string
}
