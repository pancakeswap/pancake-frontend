import { FooterLinkType } from '@tovaswapui/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [      
      {
        label: t('Blog'),
        href: 'https://medium.com/@tovafinance',
      },
      {
        label: t('Community'),
        href: 'https://telegram',
      },
      {
        label: t('TVS token'),
        href: 'https://docs.tovaswap.com/tokenomics/tvs',
      }
    ],
  },
  {
    label: t('Help'),
    items: [
      {
        label: t('Customer Support'),
        href: 'https://docs.tovaswap.com/contact-us/customer-support',
      },
      {
        label: t('Troubleshooting'),
        href: 'https://docs.tovaswap.com/help/troubleshooting',
      },
      {
        label: t('Guides'),
        href: 'https://docs.tovaswap.com/get-started',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/TOVAFinance',
      },
      {
        label: t('Documentation'),
        href: 'https://docs.tovaswap.com',
      },
      {
        label: t('Audits'),
        href: 'https://docs.tovswap.com/help/faq#is-tovaswap-safe-has-tovaswap-been-audited',
      }
    ],
  },
]
