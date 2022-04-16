import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, MediumIcon } from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.KiwanoSwap.io/contact-us",
      },
      {
        label: "Blog",
        href: "https://pancakeswap.medium.com/",
      },
      {
        label: "Community",
        href: "https://docs.KiwanoSwap.io/contact-us/telegram",
      },
      {
        label: "WANO",
        href: "https://docs.KiwanoSwap.io/tokenomics/WANO",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://pancakeswap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.KiwanoSwap.io/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.KiwanoSwap.io/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.KiwanoSwap.io/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/pancakeswap",
      },
      {
        label: "Documentation",
        href: "https://docs.KiwanoSwap.io",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@pancakeswap-1/s/pancakeswap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.KiwanoSwap.io/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.KiwanoSwap.io/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/pancakeswap",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/pancakeswap",
      },
      {
        label: "Bahasa Indonesia",
        href: "https://t.me/KiwanoSwapIndonesia",
      },
      {
        label: "中文",
        href: "https://t.me/KiwanoSwap_CN",
      },
      {
        label: "Tiếng Việt",
        href: "https://t.me/KiwanoSwapVN",
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
        href: "https://t.me/KiwanoSwapPortuguese",
      },
      {
        label: "Español",
        href: "https://t.me/PancakeswapEs",
      },
      {
        label: "日本語",
        href: "https://t.me/pancakeswapjp",
      },
      {
        label: "Français",
        href: "https://t.me/pancakeswapfr",
      },
      {
        label: "Deutsch",
        href: "https://t.me/KiwanoSwap_DE",
      },
      {
        label: "Filipino",
        href: "https://t.me/Pancakeswap_Ph",
      },
      {
        label: "ქართული ენა",
        href: "https://t.me/KiwanoSwapGeorgia",
      },
      {
        label: "Announcements",
        href: "https://t.me/KiwanoSwapAnn",
      },
    ],
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/pancakeswap/",
  },
  {
    label: "Medium",
    icon: MediumIcon,
    href: "https://pancakeswap.medium.com/",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
