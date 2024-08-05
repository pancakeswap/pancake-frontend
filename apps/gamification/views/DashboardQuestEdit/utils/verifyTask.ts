import {
  TaskBlogPostConfig,
  TaskConfigType,
  TaskHoldTokenConfig,
  TaskLiquidityConfig,
  TaskLotteryConfig,
  TaskSocialConfig,
  TaskSwapConfig,
} from 'views/DashboardQuestEdit/context/types'
import { TaskType } from 'views/DashboardQuestEdit/type'
import {
  validateIsNotEmpty,
  validateLpAddress,
  validateNumber,
  validateUrl,
} from 'views/DashboardQuestEdit/utils/validateFormat'

export const verifyTask = (task: TaskConfigType) => {
  switch (task.taskType as TaskType) {
    case TaskType.MAKE_A_SWAP:
    case TaskType.HOLD_A_TOKEN:
      return !validateNumber((task as TaskSwapConfig | TaskHoldTokenConfig).minAmount)
    case TaskType.PARTICIPATE_LOTTERY:
      return (
        !validateNumber((task as TaskLotteryConfig).toRound.toString()) &&
        !validateNumber((task as TaskLotteryConfig).fromRound.toString()) &&
        !validateNumber((task as TaskLotteryConfig).minAmount.toString())
      )
    case TaskType.ADD_LIQUIDITY:
      return (
        !validateLpAddress((task as TaskLiquidityConfig).lpAddress) &&
        !validateNumber((task as TaskLiquidityConfig).minAmount) &&
        !validateUrl((task as TaskLiquidityConfig).lpAddressLink) &&
        !validateIsNotEmpty((task as TaskLiquidityConfig).feeTier) &&
        !validateNumber((task as TaskLiquidityConfig).stakePeriodInDays.toString())
      )
    case TaskType.VISIT_BLOG_POST:
      return !validateIsNotEmpty((task as TaskBlogPostConfig).blogUrl)
    case TaskType.X_LIKE_POST:
    case TaskType.X_REPOST_POST:
    case TaskType.X_FOLLOW_ACCOUNT:
    case TaskType.TELEGRAM_JOIN_GROUP:
    case TaskType.DISCORD_JOIN_SERVER:
    case TaskType.YOUTUBE_SUBSCRIBE:
    case TaskType.IG_LIKE_POST:
    case TaskType.IG_COMMENT_POST:
    case TaskType.IG_FOLLOW_ACCOUNT:
      return (
        !validateIsNotEmpty(task.title) &&
        !validateIsNotEmpty((task as TaskSocialConfig).accountId) &&
        !validateUrl((task as TaskSocialConfig).socialLink)
      )
    default:
      return true
  }
}
