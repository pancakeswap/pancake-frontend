export type TranslatableText =
  | string
  | {
      key: string
      data?: {
        [key: string]: string | number
      }
    }

export type CampaignType = 'ifo' | 'teambattle' | 'participation'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}
