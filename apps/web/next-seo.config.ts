import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Tesseract',
  defaultTitle: 'Tesseract',
  description: 'Trade, earn, and own tokens on the all-in-one DEX',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Tesseract',
    site: '@Tesseract',
  },
  openGraph: {
    title: "Tesseract - Everyone's Favorite DEX",
    description: 'Trade, earn, and own tokens on the all-in-one DEX',
    images: [{ url: 'https://cdn.jsdelivr.net/gh/tesseract-world/assets@main/tesseract-banner.png' }],
  },
}
