import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Safemoon',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/imadafasfasfages/hero.png',
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
        title: `${t('Home')} | ${t('Safemoon')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('Safemoon')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('Safemoon')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('Safemoon')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('Safemoon')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('Safemoon')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Safemoon')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Safemoon')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('Safemoon')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Safemoon')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('Safemoon')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Safemoon')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Safemoon')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Safemoon')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Safemoon')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('Safemoon')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('Safemoon')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('Safemoon')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('Safemoon Info & Analytics')}`,
        description: 'View statistics for Safemoon exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('Safemoon Info & Analytics')}`,
        description: 'View statistics for Safemoon exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('Safemoon Info & Analytics')}`,
        description: 'View statistics for Safemoon exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('Safemoon')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('Safemoon')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('Safemoon')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('Safemoon')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('Safemoon')}`,
      }
    default:
      return null
  }
}
