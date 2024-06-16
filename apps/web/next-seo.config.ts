import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | FraxcakeSwap',
  defaultTitle: 'FraxcakeSwap',
  description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@FraxcakeSwap',
    site: '@FraxcakeSwap',
  },
  openGraph: {
    title: "🥞 FraxcakeSwap - Everyone's Favorite DEX",
    description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
  },
}
