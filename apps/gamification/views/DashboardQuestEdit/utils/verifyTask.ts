import {
  TaskBlogPostConfig,
  TaskConfigType,
  TaskHoldTokenConfig,
  TaskSocialConfig,
  TaskSwapConfig,
} from 'views/DashboardQuestEdit/context/types'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { validateIsNotEmpty, validateNumber, validateUrl } from 'views/DashboardQuestEdit/utils/validateFormat'

export const verifyTask = (task: TaskConfigType) => {
  switch (task.taskType as TaskType) {
    case TaskType.MAKE_A_SWAP:
    case TaskType.HOLD_A_TOKEN:
      return validateNumber((task as TaskSwapConfig | TaskHoldTokenConfig).minAmount)
    case TaskType.ADD_BLOG_POST:
      return validateIsNotEmpty((task as TaskBlogPostConfig).blogUrl)
    case TaskType.X_LINK_POST:
    case TaskType.X_REPOST_POST:
    case TaskType.X_FOLLOW_ACCOUNT:
    case TaskType.TELEGRAM_JOIN_GROUP:
    case TaskType.DISCORD_JOIN_SERVICE:
    case TaskType.YOUTUBE_SUBSCRIBE:
    case TaskType.IG_LIKE_POST:
    case TaskType.IG_COMMENT_POST:
    case TaskType.IG_FOLLOW_ACCOUNT:
      return validateIsNotEmpty(task.title) && validateUrl((task as TaskSocialConfig).socialLink)
    default:
      return true
  }
}
