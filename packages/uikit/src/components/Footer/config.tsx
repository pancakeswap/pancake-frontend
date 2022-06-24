import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, MediumIcon } from "../Svg";

export const footerLinks: FooterLinkType[] = [
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
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/metaegg_io",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/metaegg_en",
      },
      {
        label: "Bahasa Indonesia",
        href: "https://t.me/metaegg_io",
      },
      {
        label: "中文",
        href: "https://t.me/metaegg_cn",
      },
      {
        label: "Tiếng Việt",
        href: "https://t.me/metaegg_vn",
      },
      {
        label: "Italiano",
        href: "https://t.me/metaegg_io",
      },
      {
        label: "русский",
        href: "https://t.me/metaegg_ru",
      },
      {
        label: "Türkiye",
        href: "https://t.me/metaegg_tr",
      },
      {
        label: "Português",
        href: "https://t.me/metaegg_io",
      },
      {
        label: "Español",
        href: "https://t.me/metaegg_es",
      },
      {
        label: "日本語",
        href: "https://t.me/metaegg_jp",
      },
      {
        label: "Français",
        href: "https://t.me/metaegg_fr",
      },
      {
        label: "Deutsch",
        href: "https://t.me/metaegg_io",
      },
      {
        label: "Filipino",
        href: "https://t.me/metaegg_io",
      },
      {
        label: "ქართული ენა",
        href: "https://t.me/metaegg_io",
      },
      {
        label: "Announcements",
        href: "https://t.me/metaegg_ann",
      },
    ],
  },
  {
    label: "Reddit",
    icon: RedditIcon,
    href: "https://reddit.com/r/metaegg",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "https://instagram.com/metaegg_io",
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/metaegg/",
  },
  {
    label: "Discord",
    icon: DiscordIcon,
    href: "https://discord.gg/metaegg",
  },
  {
    label: "Medium",
    icon: MediumIcon,
    href: "https://medium.com/@metaegg",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
