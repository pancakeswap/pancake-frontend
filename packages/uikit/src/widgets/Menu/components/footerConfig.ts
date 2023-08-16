import { ContextApi } from "@pancakeswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: "Ecosystem",
    items: [
      {
        label: t("Trade"),
        href: "/swap",
      },
      {
        label: t("Earn"),
        href: "/pools",
      },
      {
        label: t("Game"),
        href: "https://protectors.pancakeswap.finance/",
      },
      {
        label: t("NFT"),
        href: "/nfts",
      },
      {
        label: t("Tokenomics"),
        href: "/swap",
      },
      {
        label: t("Litepaper"),
        href: "https://v2litepaper.pancakeswap.finance/",
      },
      {
        label: t("CAKE Emission Projection"),
        href: "https://analytics.pancakeswap.finance/",
      },
      {
        label: t("Terms Of Service"),
        href: "https://pancakeswap.finance/terms-of-service",
      },
      {
        label: "—",
      },
      {
        label: t("Merchandise"),
        href: "https://merch.pancakeswap.finance/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Business",
    items: [
      {
        label: t("Farms and Syrup Pools"),
        href: "/swap",
      },
      {
        label: t("IFO"),
        href: "/swap",
      },
      {
        label: t("NFT Marketplace"),
        href: "/swap",
      },
      {
        label: t("Etherum Expansion"),
        href: "/swap",
      },
      {
        label: t("Aptos Development"),
        href: "/swap",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: t("Github"),
        href: "https://github.com/pancakeswap",
      },
      {
        label: t("Documentation"),
        href: "https://docs.pancakeswap.finance",
      },
      {
        label: t("Bug Bounty"),
        href: "https://docs.pancakeswap.finance/code/bug-bounty",
      },
      // {
      //   label: t("Audits"),
      //   href: "https://docs.pancakeswap.finance/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited",
      // },
    ],
  },
  {
    label: t("Support"),
    items: [
      {
        label: t("Contact"),
        href: "https://docs.pancakeswap.finance/contact-us",
      },
      // {
      //   label: t("Customer Support"),
      //   href: "https://docs.pancakeswap.finance/contact-us/customer-support",
      // },
      {
        label: t("Troubleshooting"),
        href: "https://docs.pancakeswap.finance/help/troubleshooting",
      },
      {
        label: t("FAQ"),
        href: "https://docs.pancakeswap.finance/get-started",
      },
    ],
  },
  {
    label: t("About"),
    items: [
      {
        label: t("Terms Of Service"),
        href: "https://pancakeswap.finance/terms-of-service",
      },
      {
        label: t("Blog"),
        href: "https://blog.pancakeswap.finance/",
      },
      {
        label: t("Brand Assets"),
        href: "https://docs.pancakeswap.finance/brand",
      },
      {
        label: t("Careers"),
        href: "https://docs.pancakeswap.finance/hiring/become-a-chef",
      },
      {
        label: t("Community"),
        href: "https://docs.pancakeswap.finance/contact-us/telegram",
      },
    ],
  },
];
