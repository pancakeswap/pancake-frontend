import { ContextApi } from "@pancakeswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("Coingecko"),
    items: [
      {
        label: t("opBOMB"),
        href: "https://google.com",
      },
      {
        label: t("TSHARE"),
        href: "https://google.com",
      },
      {
        label: t("LSHARE"),
        href: "https://google.com",
      },
    ],
  },
  {
    label: t("opBOMB Dex"),
    items: [
      {
        label: t("Coingecko"),
        href: "https://google.com",
      },
      {
        label: t("Geckoterminal"),
        href: "https://google.com",
      },
      {
        label: t("Dex Screener"),
        href: "https://google.com",
      },
    ],
  },
  {
    label: t("opBOMB Chain"),
    items: [
      {
        label: "opBOMB Chain",
        href: "https://google.com",
      },
      {
        label: t("opBOMBScout Block Explorer"),
        href: "https://google.com",
      },
      {
        label: t("Bridge"),
        href: "https://google.com",
      },
    ],
  },
  {
    label: t("LIF3 on opBOMB Chain"),
    items: [
      {
        label: "LIF3.com",
        href: "https://google.com",
      },
      {
        label: t("Analytics"),
        href: "https://google.com",
      },
    ],
  },
];
