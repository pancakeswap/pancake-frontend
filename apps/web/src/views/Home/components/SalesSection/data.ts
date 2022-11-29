import { TranslateFunction } from '@pancakeswap/localization'
import { SalesSectionProps } from '.'
import iceConeA from '../../../../../public/images/home/trade/iceconea.png'
import iceConeB from '../../../../../public/images/home/trade/iceconeb.png'
import bridgeA from '../../../../../public/images/home/bridge/bridge_a.png'
import bridgeB from '../../../../../public/images/home/bridge/bridge_b.png'
import earnIce from '../../../../../public/images/home/earn/ice.png'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Trade anything anywhere, hassle free'),
  bodyText: t(
      'IceCreamSwap let\'s everyone trade any token on multiple chains. ' +
      'A very intuitive UI lets both new and experienced DeFi users fully emerge in the world of crypto trading. ' +
      'As the first DEX implementing route splitting, the best possible outputs with the lowest slippage is guaranteed. '
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
    attributes: [
      { src: iceConeA, alt: '' },
      { src: iceConeB, alt: '' },
    ],
  },
})

export const bridgeSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Bridge securely between many chains'),
  bodyText: t(
    'IceCreamSwap allows direct bridging between manny chains. ' +
      'A novel approach of a second (redundant) security layer will make the IceCream Bridge even more secure ' +
      'than the audited and battle tested code it is built on top of. ' +
      'All bridge reserves are transparent on chain and can be verified any time. ' +
      'Due to it\'s universal implementation even raw data and NFT\'s will be supported by the Bridge.',
  ),
  reverse: true,
  primaryButton: {
    to: 'https://bridge.icecreamswap.com',
    text: 'Bridge Now',
    external: false,
  },
  secondaryButton: {
    to: 'https://wiki.icecreamswap.com/get-started/bridge',
    text: t('Learn'),
    external: true,
  },
  images: {
    attributes: [
      { src: bridgeA, alt: '' },
      { src: bridgeB, alt: '' },
    ],
  },
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Earn, let your tokens work for you.'),
  bodyText: t('Thanks to liquidity farming pools, you can earn passive income on top of your crypto tokens.'),
  reverse: false,
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
    attributes: [{ src: earnIce, alt: '' }],
  },
})
