import { useTranslation } from '@pancakeswap/localization'
import { BunnyFillIcon, DiscordIcon, InstagramIcon, TelegramIcon, TwitterIcon, YoutubeIcon } from '@pancakeswap/uikit'
import { useCallback } from 'react'
import { TaskType } from 'views/DashboardQuestEdit/type'

export const useTaskInfo = (primaryColor?: boolean) => {
  const { t } = useTranslation()
  const color = primaryColor ? 'primary' : '#7A6EAA'

  const taskIcon = useCallback(
    (social: TaskType) => {
      switch (social) {
        case TaskType.MAKE_A_SWAP:
        case TaskType.ADD_LIQUIDITY:
        case TaskType.PARTICIPATE_LOTTERY:
        case TaskType.MAKE_PREDICTION:
          return <BunnyFillIcon color={color} width="20px" height="20px" />
        case TaskType.X_LINK_POST:
        case TaskType.X_FOLLOW_ACCOUNT:
        case TaskType.X_REPOST_POST:
          return <TwitterIcon color={color} width="20px" height="20px" />
        case TaskType.TELEGRAM_JOIN_GROUP:
          return <TelegramIcon color={color} width="20px" height="20px" />
        case TaskType.DISCORD_JOIN_SERVICE:
          return <DiscordIcon color={color} width="20px" height="20px" />
        case TaskType.YOUTUBE_SUBSCRIBE:
          return <YoutubeIcon color={color} width="20px" height="20px" />
        case TaskType.IG_LIKE_POST:
        case TaskType.IG_COMMENT_POST:
        case TaskType.IG_FOLLOW_ACCOUNT:
          return <InstagramIcon color={color} width="20px" height="20px" />
        default:
          return null
      }
    },
    [color],
  )

  const taskNaming = useCallback(
    (social: TaskType) => {
      switch (social) {
        case TaskType.MAKE_A_SWAP:
          return t('Make a swap')
        case TaskType.ADD_LIQUIDITY:
          return t('Add liquidity')
        case TaskType.PARTICIPATE_LOTTERY:
          return t('Participate in a lottery')
        case TaskType.MAKE_PREDICTION:
          return t('Make a prediction')
        case TaskType.X_LINK_POST:
        case TaskType.IG_LIKE_POST:
          return t('Like the post')
        case TaskType.X_FOLLOW_ACCOUNT:
        case TaskType.IG_FOLLOW_ACCOUNT:
          return t('Follow the account')
        case TaskType.X_REPOST_POST:
          return t('Repost the post')
        case TaskType.TELEGRAM_JOIN_GROUP:
          return t('Join the group')
        case TaskType.DISCORD_JOIN_SERVICE:
          return t('Join the server')
        case TaskType.YOUTUBE_SUBSCRIBE:
          return t('Subscribe to the channel')
        case TaskType.IG_COMMENT_POST:
          return t('Comment on the post')
        default:
          return ''
      }
    },
    [t],
  )

  const taskInputPlaceholder = useCallback(
    (social: TaskType) => {
      switch (social) {
        case TaskType.X_LINK_POST:
        case TaskType.X_REPOST_POST:
          return t('X post link')
        case TaskType.X_FOLLOW_ACCOUNT:
          return t('X account link')
        case TaskType.TELEGRAM_JOIN_GROUP:
          return t('Telegram group link')
        case TaskType.DISCORD_JOIN_SERVICE:
          return t('Discord server link')
        case TaskType.YOUTUBE_SUBSCRIBE:
          return t('YouTube channel link')
        case TaskType.IG_LIKE_POST:
        case TaskType.IG_COMMENT_POST:
          return t('Instagram post link')
        case TaskType.IG_FOLLOW_ACCOUNT:
          return t('Instagram account link')
        default:
          return ''
      }
    },
    [t],
  )

  return {
    taskIcon,
    taskNaming,
    taskInputPlaceholder,
  }
}
