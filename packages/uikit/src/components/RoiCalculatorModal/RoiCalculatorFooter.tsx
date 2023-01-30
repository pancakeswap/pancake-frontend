import { useTranslation } from "@pancakeswap/localization";
import { getApy } from "@pancakeswap/utils/compoundApyHelpers";
import { useMemo, useState } from "react";
import styled from "styled-components";

import { BIG_ONE_HUNDRED } from "@pancakeswap/utils/bigNumber";
import { useTooltip } from "../../hooks/useTooltip";
import { Box, Flex, Grid } from "../Box";
import { ExpandableLabel } from "../Button";
import { Link, LinkExternal } from "../Link";
import { HelpIcon } from "../Svg";
import { Text } from "../Text";

const Footer = styled(Flex)`
  width: 100%;
  background: ${({ theme }) => theme.colors.dropdown};
`;

const BulletList = styled.ul`
  list-style-type: none;
  margin-top: 16px;
  padding: 0;
  li {
    margin: 0;
    padding: 0;
  }
  li::before {
    content: "•";
    margin-right: 4px;
    color: ${({ theme }) => theme.colors.textSubtle};
  }
  li::marker {
    font-size: 12px;
  }
`;

interface RoiCalculatorFooterProps {
  isFarm: boolean;
  apr?: number;
  apy?: number;
  displayApr?: string;
  autoCompoundFrequency: number;
  multiplier?: string;
  linkLabel: string;
  linkHref: string;
  performanceFee: number;
  rewardCakePerSecond?: boolean;
  isLocked?: boolean;
  stableSwapAddress?: string;
  stableLpFee?: number;
}

const RoiCalculatorFooter: React.FC<React.PropsWithChildren<RoiCalculatorFooterProps>> = ({
  isFarm,
  apr = 0,
  apy = 0,
  displayApr,
  autoCompoundFrequency,
  multiplier,
  linkLabel,
  linkHref,
  performanceFee,
  rewardCakePerSecond,
  isLocked = false,
  stableSwapAddress,
  stableLpFee,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const {
    targetRef: multiplierRef,
    tooltip: multiplierTooltip,
    tooltipVisible: multiplierTooltipVisible,
  } = useTooltip(
    <>
      {rewardCakePerSecond ? (
        <>
          <Text>
            {t(
              "The Multiplier represents the proportion of CAKE rewards each farm receives, as a proportion of the CAKE produced each second."
            )}
          </Text>
          <Text my="24px">
            {" "}
            {t("For example, if a 1x farm received 1 CAKE per second, a 40x farm would receive 40 CAKE per second.")}
          </Text>
          <Text>{t("This amount is already included in all APR calculations for the farm.")}</Text>
        </>
      ) : (
        <>
          <Text>
            {t(
              "The Multiplier represents the proportion of CAKE rewards each farm receives, as a proportion of the CAKE produced each block."
            )}
          </Text>
          <Text my="24px">
            {" "}
            {t("For example, if a 1x farm received 1 CAKE per block, a 40x farm would receive 40 CAKE per block.")}
          </Text>
          <Text>
            {t(
              "We have recently rebased multipliers by a factor of 10, this is only a visual change and does not affect the amount of CAKE each farm receives."
            )}
          </Text>
          <Link
            mt="8px"
            display="inline"
            href="https://medium.com/pancakeswap/farm-mutlipliers-visual-update-1f5f5f615afd"
            external
          >
            {t("Read more")}
          </Link>
        </>
      )}
    </>,
    { placement: "top-end", tooltipOffset: [20, 10] }
  );

  const gridRowCount = isFarm ? 4 : 2;
  const lpRewardsAPR = useMemo(
    () =>
      isFarm
        ? Number.isFinite(Number(displayApr)) && Number.isFinite(apr)
          ? Math.max(Number(displayApr) - apr, 0).toFixed(2)
          : null
        : null,
    [isFarm, displayApr, apr]
  );

  return (
    <Footer p="16px" flexDirection="column">
      <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)}>
        {isExpanded ? t("Hide") : t("Details")}
      </ExpandableLabel>
      {isExpanded && (
        <Box px="8px">
          <Grid gridTemplateColumns="2.5fr 1fr" gridRowGap="8px" gridTemplateRows={`repeat(${gridRowCount}, auto)`}>
            {!isFarm && (
              <>
                <Text color="textSubtle" small>
                  {Number.isFinite(apy) && apy !== 0 && !isLocked ? t("APY") : t("APR")}
                </Text>
                <Text small textAlign="right">
                  {Number.isFinite(apy) && apy !== 0 ? apy.toFixed(2) : apr?.toFixed(2)}%
                </Text>
              </>
            )}
            {isFarm && (
              <>
                <Text color="textSubtle" small>
                  {t("APR (incl. LP rewards)")}
                </Text>
                <Text small textAlign="right">
                  {displayApr}%
                </Text>
                <Text color="textSubtle" small>
                  *{t("Base APR (CAKE yield only)")}
                </Text>
                <Text small textAlign="right">
                  {apr.toFixed(2)}%
                </Text>
                <Text color="textSubtle" small>
                  *{t("LP Rewards APR")}
                </Text>
                <Text small textAlign="right">
                  {lpRewardsAPR === "0" || !lpRewardsAPR ? "-" : lpRewardsAPR}%
                </Text>
              </>
            )}
            {!Number.isFinite(apy) && (
              <Text color="textSubtle" small>
                {t("APY (%compoundTimes%x daily compound)", {
                  compoundTimes: autoCompoundFrequency > 0 ? autoCompoundFrequency : 1,
                })}
              </Text>
            )}
            {!Number.isFinite(apy) && (
              <Text small textAlign="right">
                {(
                  getApy(apr, autoCompoundFrequency > 0 ? autoCompoundFrequency : 1, 365, performanceFee) * 100
                ).toFixed(2)}
                %
              </Text>
            )}
            {isFarm && (
              <>
                <Text color="textSubtle" small>
                  {t("Farm Multiplier")}
                </Text>
                <Flex justifyContent="flex-end" alignItems="flex-end">
                  <Text small textAlign="right" mr="4px">
                    {multiplier}
                  </Text>
                  <span ref={multiplierRef}>
                    <HelpIcon color="textSubtle" width="16px" height="16px" />
                  </span>
                  {multiplierTooltipVisible && multiplierTooltip}
                </Flex>
              </>
            )}
          </Grid>
          <BulletList>
            <li>
              <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline" lineHeight={1.1}>
                {t("Calculated based on current rates.")}
              </Text>
            </li>
            {isFarm && (
              <>
                <li>
                  <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline">
                    {t("LP rewards: %percent%% trading fees, distributed proportionally among LP token holders.", {
                      percent: stableSwapAddress && stableLpFee ? BIG_ONE_HUNDRED.times(stableLpFee).toNumber() : 0.17,
                    })}
                  </Text>
                </li>
                <li>
                  <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline">
                    {t(
                      "To provide stable estimates, APR figures are calculated once per day on the farm page. For real time APR, please visit the"
                    )}
                    <Link
                      style={{ display: "inline-block" }}
                      fontSize="12px"
                      ml="3px"
                      href={`/info${stableSwapAddress ? `/pairs/${stableSwapAddress}?type=stableSwap` : ""}`}
                    >
                      {t("Info Page")}
                    </Link>
                  </Text>
                </li>
              </>
            )}
            <li>
              <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline" lineHeight={1.1}>
                {t(
                  "All figures are estimates provided for your convenience only, and by no means represent guaranteed returns."
                )}
              </Text>
            </li>
            {performanceFee > 0 && (
              <li>
                <Text mt="14px" fontSize="12px" textAlign="center" color="textSubtle" display="inline">
                  {t("All estimated rates take into account this pool’s %fee%% performance fee", {
                    fee: performanceFee,
                  })}
                </Text>
              </li>
            )}
          </BulletList>
          {linkHref && (
            <Flex justifyContent="center" mt="24px">
              <LinkExternal href={linkHref}>{linkLabel}</LinkExternal>
            </Flex>
          )}
        </Box>
      )}
    </Footer>
  );
};

export default RoiCalculatorFooter;
