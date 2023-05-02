import { useTranslation } from "@pancakeswap/localization";
import { useTooltip, HelpIcon, Link } from "@pancakeswap/uikit";
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
  multiplier?: string;
  farmCakePerSecond?: string;
  totalMultipliers?: string;
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

const InlineText = styled(Text)`
  display: inline;
`;

const InlineLink = styled(Link)`
  display: inline-block;
  margin: 0 4px;
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
  multiplier,
  farmCakePerSecond,
  totalMultipliers,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation();

  const multiplierTooltipContent = (
    <>
      <Text bold>
        {t("Farm’s CAKE Per Second:")}
        <InlineText marginLeft={2}>{farmCakePerSecond}</InlineText>
      </Text>
      <Text bold>
        {t("Total Multipliers:")}
        <InlineText marginLeft={2}>{totalMultipliers}</InlineText>
      </Text>
      <Text my="24px">
        {t(
          "The Farm Multiplier represents the proportion of CAKE rewards each farm receives as a proportion of its farm group."
        )}
      </Text>
      <Text my="24px">
        {t("For example, if a 1x farm received 1 CAKE per block, a 40x farm would receive 40 CAKE per block.")}
      </Text>
      <Text>
        {t("Different farm groups have different sets of multipliers.")}
        <InlineLink
          mt="8px"
          display="inline"
          href="https://docs.pancakeswap.finance/products/yield-farming/faq#why-a-2x-farm-in-v3-has-less-apr-than-a-1x-farm-in-v2"
          external
        >
          {t("Learn More")}
        </InlineLink>
      </Text>
    </>
  );

  const { targetRef, tooltip, tooltipVisible } = useTooltip(multiplierTooltipContent, {
    placement: "bottom",
  });

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
      <Flex justifyContent="space-between">
        <Text>{t("Multiplier")}:</Text>
        {multiplier ? (
          <Flex>
            <Text>{multiplier}</Text>
            {tooltipVisible && tooltip}
            <Flex ref={targetRef}>
              <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
            </Flex>
          </Flex>
        ) : (
          <Skeleton width={75} height={25} />
        )}
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
