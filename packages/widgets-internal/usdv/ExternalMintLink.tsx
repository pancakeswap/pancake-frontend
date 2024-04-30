import { Tag } from "@pancakeswap/uikit";
import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { SpaceProps } from "styled-system";

import {
  ExternalCurrencyLink,
  ExternalCurrencyLinkTitle,
  ExternalCurrencyLinkDesc,
} from "../components/ExternalCurrencyLink";
import { CurrencyLogo } from "../components/CurrencyLogo";

const StyledTag = styled(Tag)`
  line-height: 1;
  padding: 0.25rem 0.5rem;
  height: auto;
`;

const USDV = {
  chainId: 56,
  symbol: "USDV",
  isToken: true,
};

export function MintLink(props: SpaceProps) {
  const { t } = useTranslation();
  const title = (
    <>
      <ExternalCurrencyLinkTitle>{t("Mint / Transfer USDV")}</ExternalCurrencyLinkTitle>
      <StyledTag variant="success">{t("New")}</StyledTag>
    </>
  );
  const desc = <ExternalCurrencyLinkDesc>{t("Swap stablecoins for USDV")}</ExternalCurrencyLinkDesc>;
  const currencyLogo = <CurrencyLogo mt={desc ? "0.125rem" : 0} currency={USDV} size="1.375rem" />;
  return (
    <ExternalCurrencyLink
      data-dd-action-name="USDV Mint"
      href="/usdv"
      currencyLogo={currencyLogo}
      title={title}
      desc={desc}
      {...props}
    />
  );
}
