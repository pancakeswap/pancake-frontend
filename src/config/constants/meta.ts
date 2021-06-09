import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'ZoeSwap',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by ZoeSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://zoeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('ZoeSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('ZoeSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('ZoeSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('ZoeSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('ZoeSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('ZoeSwap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('ZoeSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('ZoeSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('ZoeSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('ZoeSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('ZoeSwap')}`,
      }
    default:
      return null
  }
}
