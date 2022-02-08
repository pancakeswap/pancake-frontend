import { FooterLinkType } from 'peronio-uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://forms.gle/mYiFcWPpiPqxfjdZA',
      },
      {
        label: t('Main Site'),
        href: 'https://peronio.ar',
      },
      // {
      //   label: t('Blog'),
      //   href: 'https://medium.com/pancakeswap',
      // },
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
        label: t('Telegram'),
        href: 'https://t.me/peronioar',
      },
      // {
      //   label: t('Customer Support'),
      //   href: 'https://docs.pancakeswap.finance/contact-us/customer-support',
      // },
      // {
      //   label: t('Troubleshooting'),
      //   href: 'https://docs.pancakeswap.finance/help/troubleshooting',
      // },
      // {
      //   label: t('Guides'),
      //   href: 'https://docs.pancakeswap.finance/get-started',
      // },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/peronioar',
      },
      {
        label: t('Documentation'),
        href: 'https://docs.peronio.ar',
      },
      // {
      //   label: t('Bug Bounty'),
      //   href: 'https://docs.pancakeswap.finance/code/bug-bounty',
      // },
      {
        label: t('Audits'),
        href: 'https://docs.peronio.ar/crypto/auditorias',
      },
      // {
      //   label: t('Careers'),
      //   href: 'https://docs.pancakeswap.finance/hiring/become-a-chef',
      // },
    ],
  },
]
