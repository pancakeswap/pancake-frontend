import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
   {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.metaegg.io/wiki/metaegg/resources",
      },
      {
        label: "Blog",
        href: "https://medium.com/@metaegg",
      },
      {
        label: "Community",
        href: "https://docs.metaegg.io/wiki/metaegg/resources",
      },
      {
        label: "CAKE",
        href: "https://docs.metaegg.io/wiki/tokenomics/megg",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://market.metaegg.io/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Team",
        href: "https://docs.metaegg.io/wiki/team",
      },
      {
        label: "GameFi",
        href: "https://docs.metaegg.io/wiki/game-fi-elements",
      },
      {
        label: "Metaeverse",
        href: "https://docs.metaegg.io/wiki/metaverse",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/metaegg",
      },
      {
        label: "Documentation",
        href: "https://docs.metaegg.io",
      },
      {
        label: "Bug Bounty",
        href: "https://docs.metaegg.io/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.metaegg.io/audited",
      },
      {
        label: "Careers",
        href: "https://docs.metaegg.io/team",
      },
    ],
  },
]
