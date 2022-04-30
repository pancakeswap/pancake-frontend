import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'KiwanoSwap',
  description:
    'The most popular AMM on BSC by user count! Earn WANO through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by KiwanoSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://KiwanoSwap.io/images/hero.png',
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
        title: `${t('Home')} | ${t('KiwanoSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('KiwanoSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('KiwanoSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('KiwanoSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('KiwanoSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('KiwanoSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('KiwanoSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('KiwanoSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('KiwanoSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('KiwanoSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('KiwanoSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('KiwanoSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('KiwanoSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('KiwanoSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('KiwanoSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('KiwanoSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('KiwanoSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('KiwanoSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('KiwanoSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('KiwanoSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('KiwanoSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('KiwanoSwap')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('KiwanoSwap')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('KiwanoSwap')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('KiwanoSwap')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('KiwanoSwap')}`,
      }
    default:
      return null
  }
}
