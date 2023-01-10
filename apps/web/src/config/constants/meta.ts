import memoize from 'lodash/memoize'
import { ContextApi } from '@pancakeswap/localization'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'PancakeSwap',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

interface PathList {
  paths: { [path: string]: { title: string; basePath?: boolean; description?: string; image?: string } }
  defaultTitleSuffix: string
}

const getPathList = (t: ContextApi['t']): PathList => {
  return {
    paths: {
      '/': { title: t('Home') },
      '/swap': { basePath: true, title: t('Exchange'), image: '/images/og/swaps.jpeg' },
      '/limit-orders': { basePath: true, title: t('Limit Orders'), image: '/images/og/limit.jpeg' },
      '/add': { basePath: true, title: t('Add Liquidity'), image: '/images/og/liquidity.jpeg' },
      '/remove': { basePath: true, title: t('Remove Liquidity'), image: '/images/og/liquidity.jpeg' },
      '/liquidity': { title: t('Liquidity'), image: '/images/og/liquidity.jpeg' },
      '/find': { title: t('Import Pool') },
      '/competition': { title: t('Trading Battle') },
      '/prediction': { title: t('Prediction'), image: '/images/og/prediction.jpeg' },
      '/prediction/leaderboard': { title: t('Leaderboard'), image: '/images/og/liquidity.jpeg' },
      '/farms': { title: t('Farms'), image: '/images/og/farms.jpeg' },
      '/farms/auction': { title: t('Farm Auctions'), image: '/images/og/liquidity.jpeg' },
      '/pools': { title: t('Pools'), image: '/images/og/pools.jpeg' },
      '/lottery': { title: t('Lottery'), image: '/images/og/lottery.jpeg' },
      '/ifo': { title: t('Initial Farm Offering'), image: '/images/og/ifo.jpeg' },
      '/teams': { basePath: true, title: t('Leaderboard'), image: '/images/og/teams.jpeg' },
      '/voting': { basePath: true, title: t('Voting'), image: '/images/og/voting.jpeg' },
      '/voting/proposal': { title: t('Proposals'), image: '/images/og/voting.jpeg' },
      '/voting/proposal/create': { title: t('Make a Proposal'), image: '/images/og/voting.jpeg' },
      '/info': {
        title: t('Overview'),
        description: 'View statistics for Pancakeswap exchanges.',
        image: '/images/og/info.jpeg',
      },
      '/info/pairs': {
        title: t('Pairs'),
        description: 'View statistics for Pancakeswap exchanges.',
        image: '/images/og/info.jpeg',
      },
      '/info/tokens': {
        title: t('Tokens'),
        description: 'View statistics for Pancakeswap exchanges.',
        image: '/images/og/info.jpeg',
      },
      '/nfts/collections': { basePath: true, title: t('Collections'), image: '/images/og/nft.jpeg' },
      '/nfts/activity': { title: t('Activity'), image: '/images/og/nft.jpeg' },
      '/profile': { basePath: true, title: t('Profile') },
      '/pancake-squad': { basePath: true, title: t('Pancake Squad') },
      '/pottery': { basePath: true, title: t('Pottery'), image: '/images/og/pottery.jpeg' },
    },
    defaultTitleSuffix: t('PancakeSwap'),
  }
}

export const getCustomMeta = memoize(
  (path: string, t: ContextApi['t'], _: string): PageMeta => {
    const pathList = getPathList(t)
    const pathMetadata =
      pathList.paths[path] ??
      pathList.paths[Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0]]

    if (pathMetadata) {
      return {
        title: `${pathMetadata.title}`,
        ...(pathMetadata.description && { description: pathMetadata.description }),
        image: pathMetadata.image,
      }
    }
    return null
  },
  (path, t, locale) => `${path}#${locale}`,
)
