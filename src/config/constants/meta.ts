import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'PancakeSwap',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.',
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
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('PancakeSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('PancakeSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('PancakeSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('PancakeSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('PancakeSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('PancakeSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('PancakeSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('PancakeSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('PancakeSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('PancakeSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('PancakeSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('PancakeSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('PancakeSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('PancakeSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('PancakeSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('PancakeSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('PancakeSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('PancakeSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('PancakeSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('PancakeSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Pools')} | ${t('PancakeSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/nfts/profile':
      return {
        title: `${t('Your Profile')} | ${t('PancakeSwap')}`,
      }
    default:
      return null
  }
}
