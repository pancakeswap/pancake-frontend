import { ChainId } from '@pancakeswap/chains'
import { CAKE } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { nanoid } from '@reduxjs/toolkit'
import { TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { TaskType } from 'views/DashboardQuestEdit/type'

const DEFAULT_CHAIN = ChainId.BSC

export const generateNewTask = (tasks: TaskConfigType[], taskType: TaskType): TaskConfigType | null => {
  let randomId: string = nanoid(100)

  const allSid: any = tasks?.map((task) => task.sid)
  if (allSid?.includes[randomId]) {
    randomId = nanoid(20)
  }

  switch (taskType) {
    case TaskType.MAKE_A_SWAP:
      return {
        sid: randomId,
        title: '',
        description: '',
        isOptional: false,
        minAmount: '',
        taskType,
        orderNumber: 0,
        network: DEFAULT_CHAIN,
        tokenAddress: (CAKE as any)?.[DEFAULT_CHAIN]?.address,
      }
    case TaskType.HOLD_A_TOKEN:
      return {
        sid: randomId,
        title: '',
        description: '',
        isOptional: false,
        minAmount: '',
        taskType,
        orderNumber: 0,
        network: DEFAULT_CHAIN,
        minHoldDays: 0,
        tokenAddress: (CAKE as any)?.[DEFAULT_CHAIN]?.address,
      }
    case TaskType.PARTICIPATE_LOTTERY:
      return {
        sid: randomId,
        title: '',
        description: '',
        taskType,
        minAmount: 0,
        fromRound: 0,
        toRound: 0,
        orderNumber: 0,
        isOptional: false,
      }
    case TaskType.ADD_LIQUIDITY:
      return {
        sid: randomId,
        taskType,
        title: '',
        description: '',
        network: DEFAULT_CHAIN,
        minAmount: '',
        lpAddress: '',
        orderNumber: 0,
        isOptional: false,
        lpAddressLink: '',
        feeTier: FeeAmount.LOW.toString(),
        stakePeriodInDays: 0,
      }
    case TaskType.VISIT_BLOG_POST:
      return {
        sid: randomId,
        title: 'Visit the blog post',
        description: '',
        taskType,
        blogUrl: '',
        orderNumber: 0,
        isOptional: false,
      }
    case TaskType.MAKE_A_PREDICTION:
      return {
        sid: randomId,
        title: '',
        description: '',
        link: 'https://t.me/pancakefi_bot',
        taskType,
        orderNumber: 0,
        network: DEFAULT_CHAIN,
        isOptional: false,
      }
    case TaskType.X_LIKE_POST:
    case TaskType.X_REPOST_POST:
    case TaskType.X_FOLLOW_ACCOUNT:
    case TaskType.TELEGRAM_JOIN_GROUP:
    case TaskType.DISCORD_JOIN_SERVER:
    case TaskType.YOUTUBE_SUBSCRIBE:
    case TaskType.IG_LIKE_POST:
    case TaskType.IG_COMMENT_POST:
    case TaskType.IG_FOLLOW_ACCOUNT:
      return {
        sid: randomId,
        title: '',
        description: '',
        taskType,
        accountId: '',
        socialLink: '',
        orderNumber: 0,
        isOptional: false,
      }
    default:
      return null
  }
}
