import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: '#',
      },
      // {
      //   label: t('Brand'),
      //   href: 'https://docs.pancakeswap.finance/brand',
      // },
      {
        label: t('Blog'),
        href: '#',
      },
      // {
      //   label: t('Community'),
      //   href: 'https://docs.pancakeswap.finance/contact-us/telegram',
      // },
      // {
      //   label: t('CAKE token'),
      //   href: 'https://docs.pancakeswap.finance/tokenomics/cake',
      // },
      // {
      //   label: '—',
      // },
      // {
      //   label: t('Online Store'),
      //   href: 'https://pancakeswap.creator-spring.com/',
      //   isHighlighted: true,
      // },
    ],
  },
  {
    label: t('Help'),
    items: [
      {
        label: t('Customer Support'),
        href: '#',
      },
      {
        label: t('Troubleshooting'),
        href: '#',
      },
      {
        label: t('Guides'),
        href: '#',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: '#',
      },
      {
        label: t('Documentation'),
        href: '#',
      },
      // {
      //   label: t('Bug Bounty'),
      //   href: 'https://docs.pancakeswap.finance/code/bug-bounty',
      // },
      // {
      //   label: t('Audits'),
      //   href: 'https://docs.pancakeswap.finance/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited',
      // },
      // {
      //   label: t('Careers'),
      //   href: 'https://docs.pancakeswap.finance/hiring/become-a-chef',
      // },
    ],
  },
]
