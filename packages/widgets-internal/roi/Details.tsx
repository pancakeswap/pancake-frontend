import { useTranslation } from "@pancakeswap/localization";
import { Percent, ZERO_PERCENT } from "@pancakeswap/sdk";
import { Box, ExpandableLabel, Flex, Grid, Text } from "@pancakeswap/uikit";
import { BulletList, Footer } from "@pancakeswap/uikit/components/RoiCalculatorModal/RoiCalculatorFooter";
import { formatPercent } from "@pancakeswap/utils/formatFractions";
import { formatAmount } from "@pancakeswap/utils/formatInfoNumbers";
import { ReactNode, memo, useState } from "react";
import { styled } from "styled-components";

const StyledFooter = styled(Footer)`
  border-radius: 16px;
`;

interface Props {
  totalYield?: number | string;
  farmReward?: number | string;
  lpReward?: number | string;
  lpApr?: Percent;
  lpApy?: Percent;
  farmApy?: Percent;
  combinedApy?: Percent;
  farmApr?: Percent;
  externalLink?: ReactNode;
  compoundIndex?: number;
  compoundOn?: boolean;
  isFarm?: boolean;
}

export const Details = memo(function Details({
  totalYield = 0,
  externalLink,
  lpReward = 0,
  farmReward = 0,
  farmApr = ZERO_PERCENT,
  lpApr = ZERO_PERCENT,
  isFarm = false,
  compoundIndex = 0,
  compoundOn = true,
  combinedApy = ZERO_PERCENT,
}: Props) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const compoundIndexToReadableText: { [key: number]: string | undefined } = {
    0: t("2x daily compound"),
    1: t("1x daily compound"),
    2: t("1x weekly compound"),
    3: t("1x monthly compound"),
  };
  const compoundText = compoundIndexToReadableText[compoundIndex] || "";

  const details = isExpanded ? (
    <Box px="8px">
      <Grid gridTemplateColumns="2.5fr 1fr" gridRowGap="8px" gridTemplateRows="repeat(2, auto)" mb="8px">
        <Text color="textSubtle" small>
          {t("Yield")}
        </Text>
        <Text small bold textAlign="right">
          ${formatAmount(+totalYield)}
        </Text>
        <Text color="textSubtle" small style={{ textIndent: "1em" }}>
          {t("LP Fee Yield")}
        </Text>
        <Text small color="textSubtle" textAlign="right">
          ${formatAmount(+lpReward)}
        </Text>
        {isFarm && (
          <>
            <Text color="textSubtle" small style={{ textIndent: "1em" }}>
              {t("Farm Yield")}
            </Text>
            <Text small color="textSubtle" textAlign="right">
              ${formatAmount(+farmReward)}
            </Text>
          </>
        )}
      </Grid>
      <Grid gridTemplateColumns="2.5fr 1fr" gridRowGap="8px" gridTemplateRows="repeat(2, auto)" mb="8px">
        <Text color="textSubtle" small>
          {t("APR")}
        </Text>
        <Text small bold textAlign="right">
          {`${formatPercent(lpApr.add(farmApr), 5) || "0"}%`}
        </Text>
        <Text color="textSubtle" small style={{ textIndent: "1em" }}>
          {t("LP Fee APR")}
        </Text>
        <Text small color="textSubtle" textAlign="right">
          {`${formatPercent(lpApr, 5) || "0"}%`}
        </Text>
        {isFarm && farmApr && (
          <>
            <Text color="textSubtle" small style={{ textIndent: "1em" }}>
              {t("Farm APR")}
            </Text>
            <Text small color="textSubtle" textAlign="right">
              {formatPercent(farmApr, 5) || "0"}%
            </Text>
          </>
        )}
      </Grid>
      {compoundOn && (
        <Grid gridTemplateColumns="2.5fr 1fr" gridRowGap="8px" gridTemplateRows="repeat(1, auto)">
          <Text color="textSubtle" small>
            {t("APY")} {compoundText && `(${compoundText})`}
          </Text>
          <Text small bold textAlign="right">
            {`${formatPercent(combinedApy, 5) || "0"}%`}
          </Text>
        </Grid>
      )}
      <BulletList>
        <li>
          <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline" lineHeight={1.1}>
            {t(
              "Yields and rewards are calculated at the current rates and subject to change based on various external variables."
            )}
          </Text>
        </li>
        <li>
          <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline" lineHeight={1.1}>
            {t(
              "LP Fee Rewards: 0.01% ~ 1% per trade according to the specific fee tier of the trading pair, claimed and compounded manually."
            )}
          </Text>
        </li>
        <li>
          <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline" lineHeight={1.1}>
            {t(
              "LP Fee APR figures are calculated using Subgraph and may subject to indexing delays. For more accurate LP Fee APR, please visit the Info Page."
            )}
          </Text>
        </li>
        <li>
          <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline" lineHeight={1.1}>
            {t(
              "All figures are estimates provided for your convenience only, and by no means represent guaranteed returns."
            )}
          </Text>
        </li>
      </BulletList>
      {externalLink && (
        <Flex justifyContent="center" mt="24px">
          {externalLink}
        </Flex>
      )}
    </Box>
  ) : null;

  return (
    <StyledFooter p="16px" flexDirection="column">
      <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)}>
        {isExpanded ? t("Hide") : t("Details")}
      </ExpandableLabel>
      {details}
    </StyledFooter>
  );
});
