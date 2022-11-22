import { ContextApi } from '@pancakeswap/localization'

type FAQsType = {
  t: ContextApi['t']
}

const config = ({ t }: FAQsType) => [
  {
    icon: '🚀',
    title: t('Launch'),
    description: [
      'Launch of the swapping and liquidity provision functionality.',
      'Provision of Icecream project token with multiple Icecream airdrops to the community',
      'Creation of end-point and support for all bridged token after the official stablecoin bridge is live',
      'Create a analytics page for the swap to show all pools, their liquidity, volume and much more.',
    ],
    reached: '06-2022',
  },
  {
    title: t('Development'),
    icon: '👨‍💻',
    description: [
      'Partner up with other projects so that they can provide liquidity for their project token',
      'AMA sessions to spread the word and inform our users',
      'Build a redundant infrastructure for maxuímal reliablility',
      'Work even closer with the Bitgert blockchain team',
      'More iceCream Airdrops',
    ],
    reached: '07-2022',
  },
  {
    title: t('Multi Chain'),
    icon: '🌐',
    description: ['Add more chains to our Bridge (Doken, Fuse)', 'More AirDrops', 'Super reliable Bridge', 'LaunchPad'],
    reached: '10-2022',
  },
  {
    title: t('Massive expansion'),
    icon: '🚀',
    description: ['Masive expansion to may chains', 'Second layer of bridge security', 'More AirDrops'],
    reached: '11-2022',
  },
  {
    title: t('To infinity and beyond'),
    icon: '🌔',
    description: ['Secret project that combines our Bridge and Swap to redefine the whole multi chain DeFi ecosystem'],
  },
]
export default config
