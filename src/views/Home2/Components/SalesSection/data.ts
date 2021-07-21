import { SalesSectionProps } from '.'

export const swapSectionData: SalesSectionProps = {
  headingText: 'Trade anything. No registration, no hassle.',
  bodyText: 'Trade any token on Binance Smart Chain in seconds, just by connecting your wallet.',
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: 'Trade Now',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.pancakeswap.finance/',
    text: 'Learn',
    external: true,
  },
  images: [
    { src: '/images/home/trade/BNB.png', alt: 'BNB token' },
    { src: '/images/home/trade/BTC.png', alt: 'BTC token' },
    { src: '/images/home/trade/CAKE.png', alt: 'CAKE token' },
  ],
}

export const earnSectionData: SalesSectionProps = {
  headingText: 'Earn passive income with crypto.',
  bodyText: 'PancakeSwap makes it easy to make your crypto work for you.',
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: 'Explore',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.pancakeswap.finance/products/yield-farming',
    text: 'Learn',
    external: true,
  },
  images: [
    { src: '/images/home/earn/pie.png', alt: 'Pie chart' },
    { src: '/images/home/earn/stonks.png', alt: 'Stocks chart' },
    { src: '/images/home/earn/folder.png', alt: 'Folder with cake token' },
  ],
}

export const cakeSectionData: SalesSectionProps = {
  headingText: 'CAKE makes our world go round.',
  bodyText:
    'CAKE token is at the heart of the PancakeSwap ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    text: 'Buy CAKE',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.pancakeswap.finance/tokenomics/cake',
    text: 'Learn',
    external: true,
  },
  images: [
    { src: '/images/home/cake/bottom-right.png', alt: 'Small 3d pancake' },
    { src: '/images/home/cake/top-right.png', alt: 'Small 3d pancake' },
    { src: '/images/home/cake/coin.png', alt: 'CAKE token' },
    { src: '/images/home/cake/top-left.png', alt: 'Small 3d pancake' },
  ],
}
