import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Tesseract',
  defaultTitle: 'Tesseract',
  description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Tesseract',
    site: '@Tesseract',
  },
  openGraph: {
    title: "🥞 Tesseract - Everyone's Favorite DEX",
    description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
    images: [{ url: 'https://assets.tesseract.world/web/og/v2/hero.jpg' }],
  },
}
