import { MenuEntry } from '@ricefarm/uikitv2'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade TeslaSafe v1',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://teslasafe.ricefarm.fi',
      },
      {
        label: 'Liquidity',
        href: 'https://teslasafe.ricefarm.fi/#/pool',
      },
    ],
  },
  {
    label: 'Trade Rice v2',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://exchange.pancakeswap.finance/#/swap?outputCurrency=0xC4eEFF5aab678C3FF32362D80946A3f5De4a1861',
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.pancakeswap.finance/#/add/BNB/0xC4eEFF5aab678C3FF32362D80946A3f5De4a1861',
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
    label: 'Vaults',
    icon: 'VaultIcon',
    href: '/vaults',
  },
  // {
  //   label: t('Prediction (BETA)'),
  //   icon: 'PredictionsIcon',
  //   href: '/prediction',
  // },
  // {
  //   label: t('Lottery'),
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  //   status: {
  //     text: t('Win').toLocaleUpperCase(),
  //     color: 'success',
  //   },
  // },
  // {
  //   label: t('Collectibles'),
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  // {
  //   label: t('Team Battle'),
  //   icon: 'TeamBattleIcon',
  //   href: '/competition',
  // },
  // {
  //   label: t('Teams & Profile'),
  //   icon: 'GroupsIcon',
  //   items: [
  //     {
  //       label: t('Leaderboard'),
  //       href: '/teams',
  //     },
  //     {
  //       label: t('Task Center'),
  //       href: '/profile/tasks',
  //     },
  //     {
  //       label: t('Your Profile'),
  //       href: '/profile',
  //     },
  //   ],
  // },
    // {
  //   label: t('Info'),
  //   icon: 'InfoIcon',
  //   href: 'https://pancakeswap.info',
  // },
  {
    label: t('IFO'),
    icon: 'IfoIcon',
    href: '/ifo',
  },
  {
    label: 'Referrals',
    icon: 'ReferralIcon',
    href: '/referrals',
  },
  {
    label: 'TechRate Audits',
    icon: 'AuditIcon',
    items: [
      {
        label: 'RiceFarm Audit',
        href: 'https://teslasafe.fi/pdf/TechRateRiceFarmAudit.pdf',
      },
      {
        label: 'TeslaSafe Audit',
        href: 'https://teslasafe.fi/pdf/TeslaSafe_Audit.pdf',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Chart',
        href: 'https://charts.bogged.finance/?token=0xC4eEFF5aab678C3FF32362D80946A3f5De4a1861',
      },
      {
        label: 'Github',
        href: 'https://github.com/rice-farm',
      },
      {
        label: 'Docs',
        href: 'https://docs.ricefarm.fi',
      },
      {
        label: 'TeslaSafe',
        href: 'https://teslasafe.fi',
      },
      {
        label: 'TeslaSafe Github',
        href: 'https://github.com/tesla-safe',
      },
    ],
  },
]

export default config
