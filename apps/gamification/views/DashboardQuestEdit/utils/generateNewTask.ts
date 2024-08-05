import { ChainId } from '@pancakeswap/chains'
import { CAKE } from '@pancakeswap/tokens'
import { nanoid } from '@reduxjs/toolkit'
import { TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { TaskType } from 'views/DashboardQuestEdit/type'

const DEFAULT_CHAIN = ChainId.BSC

export const generateNewTask = (tasks: TaskConfigType[], taskType: TaskType): TaskConfigType | null => {
  let randomId: string = nanoid(20)

  const allSid: any = tasks?.map((task) => task.sid)
  if (allSid.includes[randomId]) {
    randomId = nanoid(20)
  }

  switch (taskType) {
    case TaskType.MAKE_A_SWAP:
    case TaskType.HOLD_A_TOKEN:
      return {
        sid: randomId,
        title: '',
        description: '',
        isCompleted: false,
        isOptional: false,
        minAmount: '',
        taskType,
        currency: (CAKE as any)?.[DEFAULT_CHAIN],
      }
    case TaskType.PARTICIPATE_LOTTERY:
      return {
        sid: randomId,
        title: '',
        description: '',
        isCompleted: false,
        taskType,
        minAmount: '',
        fromRound: '',
        toRound: '',
        isOptional: false,
      }
    case TaskType.ADD_LIQUIDITY:
      return {
        sid: randomId,
        taskType,
        title: '',
        description: '',
        isCompleted: false,
        network: DEFAULT_CHAIN,
        minAmount: '',
        lpAddress: '',
        isOptional: false,
      }
    case TaskType.ADD_BLOG_POST:
      return {
        sid: randomId,
        title: '',
        description: '',
        isCompleted: false,
        taskType,
        blogUrl: '',
        isOptional: false,
      }
    case TaskType.X_LINK_POST:
    case TaskType.X_REPOST_POST:
    case TaskType.X_FOLLOW_ACCOUNT:
    case TaskType.TELEGRAM_JOIN_GROUP:
    case TaskType.DISCORD_JOIN_SERVICE:
    case TaskType.YOUTUBE_SUBSCRIBE:
    case TaskType.IG_LIKE_POST:
    case TaskType.IG_COMMENT_POST:
    case TaskType.IG_FOLLOW_ACCOUNT:
      return {
        sid: randomId,
        title: '',
        description: '',
        isCompleted: false,
        taskType,
        socialLink: '',
        isOptional: false,
      }
    default:
      return null
  }
}
