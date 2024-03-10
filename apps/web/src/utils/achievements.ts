import { Campaign, TranslatableText } from 'config/constants/types'
import { TranslateFunction } from '@pancakeswap/localization'

export const getAchievementTitle = (campaign: Campaign | undefined, t: TranslateFunction): TranslatableText => {
  if (!campaign) {
    return ''
  }
  const title = campaign.title as string

  switch (campaign.type) {
    case 'ifo':
      return t('IFO Shopper: %title%', { title })
    default:
      return campaign.title || ''
  }
}

export const getAchievementDescription = (campaign: Campaign | undefined, t: TranslateFunction): TranslatableText => {
  if (!campaign) {
    return ''
  }
  const title = campaign.title as string

  switch (campaign.type) {
    case 'ifo':
      return t('Participated in the %title% IFO by committing above the minimum required amount', { title })
    default:
      return campaign.description || ''
  }
}
