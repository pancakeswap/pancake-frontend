import { FooterLinkType } from '@hextech/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://hextech.gitbook.io/documentation/contact-us',
      },
      {
        label: t('Community'),
        href: 'https://hextech.gitbook.io/documentation//contact-us/telegram',
      },
      {
        label: t('CAKE token'),
        href: 'https://hextech.gitbook.io/documentation/',
      },
      {
        label: '—',
      },
    ],
  },
  {
    label: t('Help'),
    items: [
      {
        label: t('Customer Support'),
        href: 'https://hextech.gitbook.io/documentation/contact-us/customer-support',
      },
      {
        label: t('Troubleshooting'),
        href: 'https://hextech.gitbook.io/documentation/help/troubleshooting',
      },
      {
        label: t('Guides'),
        href: 'https://hextech.gitbook.io/documentation/get-started',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/hextech-dev/hextech',
      },
    ],
  },
]
