import { Tag } from "@pancakeswap/uikit";
import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { bscTokens } from "@pancakeswap/tokens";
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

export function MintLink(props: SpaceProps) {
  const { t } = useTranslation();
  const title = (
    <>
      <ExternalCurrencyLinkTitle>{t("Mint / Transfar USDV")}</ExternalCurrencyLinkTitle>
      <StyledTag variant="success">{t("New")}</StyledTag>
    </>
  );
  const desc = <ExternalCurrencyLinkDesc>{t("Swap stablecoins for USDV")}</ExternalCurrencyLinkDesc>;
  const currencyLogo = <CurrencyLogo mt={desc ? "0.125rem" : 0} currency={bscTokens.usdv} size="1.375rem" />;
  return <ExternalCurrencyLink href="/usdv" currencyLogo={currencyLogo} title={title} desc={desc} {...props} />;
}
