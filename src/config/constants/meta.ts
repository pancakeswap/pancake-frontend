import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'RootSwap',
  description:
    'The most popular AMM on RSK!',
  image: 'https://rootswap.finance/images/easter-battle.png',
}

export const customMeta: { [key: string]: PageMeta } = {
  '/competition': {
    title: 'PancakeSwap Easter Battle',
    description: 'Register now for the PancakeSwap Easter battle!',
    image: 'https://pancakeswap.finance/images/easter-battle.png',
  },
}
