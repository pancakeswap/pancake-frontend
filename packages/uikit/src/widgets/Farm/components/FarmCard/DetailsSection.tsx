import { useTranslation } from "@pancakeswap/localization";
import styled from "styled-components";
import { Flex } from "../../../../components/Box";
import { LinkExternal } from "../../../../components/Link";
import { Skeleton } from "../../../../components/Skeleton";
import { Text } from "../../../../components/Text";

export interface ExpandableSectionProps {
  scanAddressLink?: string;
  infoAddress?: string;
  removed?: boolean;
  totalValueFormatted?: string;
  lpLabel: string;
  onAddLiquidity?: (() => void) | string;
  isCommunity?: boolean;
  auctionHostingEndDate?: string;
  alignLinksToRight?: boolean;
  totalValueLabel?: string;
}

const Wrapper = styled.div`
  margin-top: 24px;
`;

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`;

const StyledText = styled(Text)`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const DetailsSection: React.FC<React.PropsWithChildren<ExpandableSectionProps>> = ({
  scanAddressLink,
  infoAddress,
  removed,
  totalValueLabel,
  totalValueFormatted,
  lpLabel,
  onAddLiquidity,
  isCommunity,
  auctionHostingEndDate,
  alignLinksToRight = true,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation();

  return (
    <Wrapper>
      {isCommunity && auctionHostingEndDate && (
        <Flex justifyContent="space-between">
          <Text>{t("Auction Hosting Ends")}:</Text>
          <Text>
            {new Date(auctionHostingEndDate).toLocaleString(locale, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </Flex>
      )}
      <Flex justifyContent="space-between">
        <Text>{totalValueLabel || t("Staked Liquidity")}:</Text>
        {totalValueFormatted ? <Text>{totalValueFormatted}</Text> : <Skeleton width={75} height={25} />}
      </Flex>
      {!removed && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? "flex-end" : "flex-start"}>
          {onAddLiquidity ? (
            typeof onAddLiquidity === "string" ? (
              <StyledLinkExternal href={onAddLiquidity}>{t("Add %symbol%", { symbol: lpLabel })}</StyledLinkExternal>
            ) : (
              <StyledText color="primary" onClick={onAddLiquidity}>
                {t("Add %symbol%", { symbol: lpLabel })}
              </StyledText>
            )
          ) : null}
        </Flex>
      )}
      {infoAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? "flex-end" : "flex-start"}>
          <StyledLinkExternal href={infoAddress}>{t("See Pair Info")}</StyledLinkExternal>
        </Flex>
      )}
      {scanAddressLink && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? "flex-end" : "flex-start"}>
          <StyledLinkExternal isBscScan href={scanAddressLink}>
            {t("View Contract")}
          </StyledLinkExternal>
        </Flex>
      )}
    </Wrapper>
  );
};
