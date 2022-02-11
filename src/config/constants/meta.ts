import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'TovaSwap',
  description:
    'Earn TVS through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens!, NFTs, and more, on a platform you can trust.',
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
        title: `${t('Home')} | ${t('TovaSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('TovaSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('TovaSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('TovaSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('TovaSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('TovaSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('TovaSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('TovaSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('TovaSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('TovaSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('TovaSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('TovaSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('TovaSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('TovaSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('TovaSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('TovaSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('TovaSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('TovaSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('TovaSwap Info & Analytics')}`,
        description: 'View statistics for TovaSwap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('TovaSwap Info & Analytics')}`,
        description: 'View statistics for TovaSwap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('TovaSwap Info & Analytics')}`,
        description: 'View statistics for TovaSwap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('TovaSwap')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('TovaSwap')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('TovaSwap')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('TovaSwap')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('TovaSwap')}`,
      }
    default:
      return null
  }
}
