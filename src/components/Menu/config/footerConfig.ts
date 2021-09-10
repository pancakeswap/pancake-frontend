import { FooterLinkType } from '@pancakeswap/uikit'

export const footerLinks: FooterLinkType[] = [
  {
    label: 'About',
    items: [
      {
        label: 'Contact',
        href: 'https://docs.pancakeswap.finance/contact-us',
      },
      {
        label: 'Blog',
        href: 'https://pancakeswap.medium.com/',
      },
      {
        label: 'Community',
        href: 'https://docs.pancakeswap.finance/contact-us/telegram',
      },
      {
        label: 'CAKE',
        href: 'https://docs.pancakeswap.finance/tokenomics/cake',
      },
      {
        label: '—',
      },
      {
        label: 'Online Store',
        href: 'https://pancakeswap.creator-spring.com/',
        isHighlighted: true,
      },
    ],
  },
  {
    label: 'Help',
    items: [
      {
        label: 'Customer',
        href: 'https://docs.pancakeswap.finance/contact-us/customer-support',
      },
      {
        label: 'Troubleshooting',
        href: 'https://docs.pancakeswap.finance/help/troubleshooting',
      },
      {
        label: 'Guides',
        href: 'https://docs.pancakeswap.finance/get-started',
      },
    ],
  },
  {
    label: 'Developers',
    items: [
      {
        label: 'Github',
        href: 'https://github.com/pancakeswap',
      },
      {
        label: 'Documentation',
        href: 'https://docs.pancakeswap.finance',
      },
      {
        label: 'Bug Bounty',
        href: 'https://app.gitbook.com/@pancakeswap-1/s/pancakeswap/code/bug-bounty',
      },
      {
        label: 'Audits',
        href: 'https://docs.pancakeswap.finance/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited',
      },
      {
        label: 'Careers',
        href: 'https://docs.pancakeswap.finance/hiring/become-a-chef',
      },
    ],
  },
]
