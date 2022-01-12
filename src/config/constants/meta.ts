import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Peronio',
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
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Peronio')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('Peronio')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('Peronio')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('Peronio')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('Peronio')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('Peronio')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Peronio')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Peronio')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('PancakeSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Peronio')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('Peronio')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Peronio')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Peronio')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Peronio')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Peronio')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('Peronio')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('Peronio')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('Peronio')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('Peronio Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('Peronio Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('Peronio Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('Peronio')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('Peronio')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('Peronio')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('Peronio')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('Peronio')}`,
      }
    default:
      return null
  }
}
