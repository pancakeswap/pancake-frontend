import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://docs.KiwanoSwap.io/contact-us',
        isHighlighted: true,
      },
      {
        label: t('Blog'),
        href: 'https://medium.com/pancakeswap',
      },
      {
        label: t('WANO token'),
        href: 'https://docs.KiwanoSwap.io/tokenomics/WANO',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/pancakeswap',
      },
    ],
  },
]
