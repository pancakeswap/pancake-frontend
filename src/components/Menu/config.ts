import { MenuEntry } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    items: [
      {
        label: t('Exchange'),
        href: 'https://exchange.pancakeswap.finance/#/swap',
      },
      {
        label: t('Liquidity'),
        href: 'https://exchange.pancakeswap.finance/#/pool',
      },
      {
        label: t('LP Migration'),
        href: 'https://v1exchange.pancakeswap.finance/#/migrate',
      },
      {
        label: t('V1 Liquidity (Old)'),
        href: 'https://v1exchange.pancakeswap.finance/#/pool',
      },
    ],
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: t('Pools'),
    icon: 'PoolIcon',
    href: '/pools',
  },
  {
    label: t('Prediction'),
    icon: 'PredictionsIcon',
    href: '/prediction',
    status: {
      text: 'BETA',
      color: 'warning',
    },
  },
  {
    label: t('Lottery'),
    icon: 'TicketIcon',
    href: '/lottery',
  },
  {
    label: t('Collectibles'),
    icon: 'NftIcon',
    href: '/collectibles',
  },
  {
    label: t('Team Battle'),
    icon: 'TeamBattleIcon',
    href: '/competition',
  },
  {
    label: t('Teams & Profile'),
    icon: 'GroupsIcon',
    items: [
      {
        label: t('Leaderboard'),
        href: '/teams',
      },
      {
        label: t('Task Center'),
        href: '/profile/tasks',
      },
      {
        label: t('Your Profile'),
        href: '/profile',
      },
    ],
  },
  {
    label: t('Info'),
    icon: 'InfoIcon',
    items: [
      {
        label: t('Overview'),
        href: 'https://pancakeswap.info',
      },
      {
        label: t('Tokens'),
        href: 'https://pancakeswap.info/tokens',
      },
      {
        label: t('Pairs'),
        href: 'https://pancakeswap.info/pairs',
      },
      {
        label: t('Accounts'),
        href: 'https://pancakeswap.info/accounts',
      },
    ],
  },
  {
    label: t('IFO'),
    icon: 'IfoIcon',
    href: '/ifo',
    status: {
      text: 'LIVE',
      color: 'success',
    },
  },
  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      {
        label: t('Contact'),
        href: 'https://docs.pancakeswap.finance/contact-us',
      },
      {
        label: t('Voting'),
        href: 'https://voting.pancakeswap.finance',
      },
      {
        label: t('Github'),
        href: 'https://github.com/pancakeswap',
      },
      {
        label: t('Docs'),
        href: 'https://docs.pancakeswap.finance',
      },
      {
        label: t('Blog'),
        href: 'https://pancakeswap.medium.com',
      },
      {
        label: t('Merch'),
        href: 'https://pancakeswap.creator-spring.com/',
      },
    ],
  },
]

export default config
