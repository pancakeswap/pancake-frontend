import { z } from 'zod'

export const ASSET_BASE_PATH = 'https://assets-agx.pages.dev'

export const OG_IMAGE_DEFAULT = `${ASSET_BASE_PATH}/web/og` as const
export const OG_TEMPLATE_IMAGE_DEFAULT = `${ASSET_BASE_PATH}/web/og-template` as const

export const FONT_BOLD = `${ASSET_BASE_PATH}/web/fonts/Kanit/Kanit-Bold.ttf`

export const zTemplate = z.enum(['swap', 'voting', 'nft', 'nft-collection', 'info-pair', 'info-token'])
type TemplateType = typeof zTemplate._type

export const OG_TEMPLATE_PATH = {
  swap: '/swap.jpeg',
  voting: '/voting.jpeg',
  nft: '/nft.jpeg',
  'nft-collection': '/nft-collection.jpeg',
  'info-pair': '/info-pair.jpeg',
  'info-token': '/info-token.jpeg',
} satisfies Record<TemplateType, string>

export const getTemplatePath = (template: keyof typeof OG_TEMPLATE_PATH) => {
  return OG_TEMPLATE_IMAGE_DEFAULT + OG_TEMPLATE_PATH[template]
}

export const getDefaultPath = (template: keyof typeof OG_TEMPLATE_PATH) => {
  return OG_IMAGE_DEFAULT + OG_TEMPLATE_PATH[template]
}
