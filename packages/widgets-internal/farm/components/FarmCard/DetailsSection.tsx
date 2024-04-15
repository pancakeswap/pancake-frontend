import { ChainId } from "@pancakeswap/chains";
import { useTranslation } from "@pancakeswap/localization";
import {
  FarmMultiplierInfo,
  Flex,
  HelpIcon,
  LinkExternal,
  ScanLink,
  Skeleton,
  Text,
  useTooltip,
} from "@pancakeswap/uikit";
import { ReactElement } from "react";
import { styled } from "styled-components";

export interface ExpandableSectionProps {
  scanAddress?: { link: string; chainId?: number; icon?: ReactElement };
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
  isV2BCakeWrapperFarm?: boolean;
}

const Wrapper = styled.div`
  margin-top: 24px;
`;

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`;

const StyledScanLink = styled(ScanLink)`
  font-weight: 400;
`;

const StyledText = styled(Text)`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const DetailsSection: React.FC<React.PropsWithChildren<ExpandableSectionProps>> = ({
  scanAddress,
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
  isV2BCakeWrapperFarm,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation();

  const multiplierTooltipContent = FarmMultiplierInfo({
    farmCakePerSecond: farmCakePerSecond ?? "-",
    totalMultipliers: totalMultipliers ?? "-",
  });

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
      {!isV2BCakeWrapperFarm && (
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
      )}
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
      {scanAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? "flex-end" : "flex-start"}>
          <StyledScanLink
            icon={scanAddress.icon}
            useBscCoinFallback={
              scanAddress.chainId ? [ChainId.BSC, ChainId.BSC_TESTNET].includes(scanAddress.chainId) : false
            }
            href={scanAddress.link}
          >
            {t("View Contract")}
          </StyledScanLink>
        </Flex>
      )}
    </Wrapper>
  );
};
