import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: 'About',
    items: [
      {
        label: 'Contact',
        href: 'https://t.me/tianguisfinance',
      },
      /*   {
        label: "Blog",
        href: "https://pancakeswap.medium.com/",
      }, */
      {
        label: 'Community',
        href: 'https://t.me/tianguisfinance',
      },
      /*   {
        label: "CAKE",
        href: "https://docs.tianguis.finance/tokenomics/cake",
      }, */
      /*  {
        label: "—",
      }, */
      /*  {
        label: "Online Store",
        href: "https://pancakeswap.creator-spring.com/",
        isHighlighted: true,
      }, */
    ],
  },
  {
    label: 'Help',
    items: [
      {
        label: 'Customer',
        href: 'https://t.me/tianguisfinance',
      },
      {
        label: 'Troubleshooting',
        href: 'https://t.me/tianguisfinance',
      },
      {
        label: 'Guides',
        href: 'https://t.me/tianguisfinance',
      },
    ],
  },
  {
    label: 'Developers',
    items: [
      {
        label: 'Github',
        href: 'https://github.com/tianguis-finance',
      },
      {
        label: 'Documentation',
        href: 'https://t.me/tianguisfinance',
      },
      {
        label: 'Bug Bounty',
        href: 'https://t.me/tianguisfinance',
      },
      {
        label: 'Audits',
        href: 'https://t.me/tianguisfinance',
      },
      {
        label: 'Careers',
        href: 'https://t.me/tianguisfinance',
      },
    ],
  },
]

export const socials = [
  {
    label: 'Twitter',
    icon: 'Twitter',
    href: 'https://twitter.com/tianguis_fi',
  },
  {
    label: 'Telegram',
    icon: 'Telegram',
    items: [
      /*  {
        label: "English",
        href: "https://t.me/pancakeswap",
      }, */
      /*  {
        label: "Bahasa Indonesia",
        href: "https://t.me/PancakeSwapIndonesia",
      },
      {
        label: "中文",
        href: "https://t.me/PancakeSwap_CN",
      },
      {
        label: "Tiếng Việt",
        href: "https://t.me/PancakeSwapVN",
      },
      {
        label: "Italiano",
        href: "https://t.me/pancakeswap_ita",
      },
      {
        label: "русский",
        href: "https://t.me/pancakeswap_ru",
      },
      {
        label: "Türkiye",
        href: "https://t.me/pancakeswapturkiye",
      },
      {
        label: "Português",
        href: "https://t.me/PancakeSwapPortuguese",
      }, */
      {
        label: 'Español',
        href: 'https://t.me/tianguisfinance',
      },
      /*   {
        label: "日本語",
        href: "https://t.me/pancakeswapjp",
      },
      {
        label: "Français",
        href: "https://t.me/pancakeswapfr",
      }, */
      {
        label: 'Announcements',
        href: 'https://t.me/tianguisfinance',
      },
      /*  {
        label: "Whale Alert",
        href: "https://t.me/PancakeSwapWhales",
      }, */
    ],
  },
  /*  {
    label: "Reddit",
    icon: "Reddit",
    href: "https://reddit.com/r/pancakeswap",
  }, */
  /* {
    label: "Instagram",
    icon: "Instagram",
    href: "https://instagram.com/pancakeswap_official",
  }, */
  {
    label: 'Github',
    icon: 'Github',
    href: 'https://github.com/tianguis-finance/',
  },
]
