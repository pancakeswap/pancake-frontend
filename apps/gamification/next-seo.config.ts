import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | PancakeSwap',
  defaultTitle: 'Game | PancakeSwap',
  description: 'Play different games on PancakeSwap, using CAKE and PancakeSwap NFTs',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@PancakeSwap',
    site: '@PancakeSwap',
  },
  openGraph: {
    title: '🥞 PancakeSwap - A next evolution DeFi exchange on BNB Smart Chain (BSC)',
    description: 'Play different games on PancakeSwap, using CAKE and PancakeSwap NFTs',
    images: [{ url: 'https://assets.pancakeswap.finance/web/og/v2/hero.jpg' }],
  },
}
