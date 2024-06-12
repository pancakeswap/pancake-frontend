import { ContextApi } from "@pancakeswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("Ecosystem"),
    items: [
      {
        label: t("Swap"),
        href: "/swap",
      },
      {
        label: t("Liquidity"),
        href: "/liquidity",
      },
      {
        label: t("Farms"),
        href: "/farms",
      },
    ],
  },
];
