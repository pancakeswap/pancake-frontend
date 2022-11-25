import { TranslateFunction } from '@pancakeswap/localization'
import { SalesSectionProps } from '.'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Trade anything. No registration, no hassle.'),
  bodyText: t(
    'IcecreamSwap provides a unified DeFi experience in a safe and intuitive environment on multiple chains. The main focus is to remove all unnecesarry complexity to provide a straightforward and intuitive DeFi experience. Also security is a main part of the IcecreamSwap ecosystem, which is why we are using the original and audited Uniswap V2 smart contracts for our Swap and are building a second layer of security on top of our industry standard and broadly used bridge architecture.',
  ),
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: t('Trade Now'),
    external: false,
  },
  secondaryButton: {
    to: 'https://wiki.icecreamswap.com/getting-started/swap',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'iceconea', alt: '' },
      { src: 'iceconeb', alt: '' },
    ],
  },
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Earn passive income with crypto.'),
  bodyText: t('IceCreamSwap makes it easy to make your crypto work for you.'),
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: 'https://wiki.icecreamswap.com/get-started/pool',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [{ src: 'ice', alt: '' }],
  },
})
