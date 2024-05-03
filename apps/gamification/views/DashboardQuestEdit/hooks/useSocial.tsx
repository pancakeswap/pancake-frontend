import { useTranslation } from '@pancakeswap/localization'
import { DiscordIcon, InstagramIcon, TelegramIcon, TwitterIcon, YoutubeIcon } from '@pancakeswap/uikit'
import { useMemo } from 'react'

export enum SocialTaskType {
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

export const useSocial = ({ social }: { social: SocialTaskType }) => {
  const { t } = useTranslation()

  const socialIcon = useMemo(() => {
    switch (social) {
      case SocialTaskType.X_LINK_POST:
      case SocialTaskType.X_FOLLOW_ACCOUNT:
      case SocialTaskType.X_REPOST_POST:
        return <TwitterIcon color="#7A6EAA" width="20px" height="20px" />
      case SocialTaskType.TELEGRAM_JOIN_GROUP:
        return <TelegramIcon color="#7A6EAA" width="20px" height="20px" />
      case SocialTaskType.DISCORD_JOIN_SERVICE:
        return <DiscordIcon color="#7A6EAA" width="20px" height="20px" />
      case SocialTaskType.YOUTUBE_SUBSCRIBE:
        return <YoutubeIcon color="#7A6EAA" width="20px" height="20px" />
      case SocialTaskType.IG_LIKE_POST:
      case SocialTaskType.IG_COMMENT_POST:
      case SocialTaskType.IG_FOLLOW_ACCOUNT:
        return <InstagramIcon color="#7A6EAA" width="20px" height="20px" />
      default:
        return null
    }
  }, [social])

  const socialNaming = useMemo(() => {
    switch (social) {
      case SocialTaskType.X_LINK_POST:
      case SocialTaskType.IG_LIKE_POST:
        return t('Like the post')
      case SocialTaskType.X_FOLLOW_ACCOUNT:
      case SocialTaskType.IG_FOLLOW_ACCOUNT:
        return t('Follow the account')
      case SocialTaskType.X_REPOST_POST:
        return t('Repost the post')
      case SocialTaskType.TELEGRAM_JOIN_GROUP:
        return t('Join the group')
      case SocialTaskType.DISCORD_JOIN_SERVICE:
        return t('Join the server')
      case SocialTaskType.YOUTUBE_SUBSCRIBE:
        return t('Subscribe to the channel')
      case SocialTaskType.IG_COMMENT_POST:
        return t('Comment on the post')
      default:
        return ''
    }
  }, [social, t])

  return {
    socialIcon,
    socialNaming,
  }
}
