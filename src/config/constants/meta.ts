import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'EliceSwap',
  description:
    'The most popular AMM on BSC by user count!',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'

 
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('EliceSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('EliceSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('EliceSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('EliceSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('EliceSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('EliceSwap')}`,
      }

    case '/info':
      return {
        title: `${t('Overview')} | ${t('EliceSwap Info & Analytics')}`,
        description: 'View statistics for EliceSwap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('EliceSwap Info & Analytics')}`,
        description: 'View statistics for EliceSwap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('EliceSwap Info & Analytics')}`,
        description: 'View statistics for EliceSwap exchanges.',
      }

    default:
      return null
  }
}
