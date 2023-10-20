import { useTranslation } from "@pancakeswap/localization";
import { Box, Link, Text, TooltipText, WarningIcon, useTooltip } from "@pancakeswap/uikit";
import { isMobile } from "react-device-detect";
import styled from "styled-components";

const InlineLink = styled(Link)`
  display: inline;
  margin-left: 4px;
`;

const MerklTooltip: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Box>
        <Text display="inline">
          <p>
            {t("Incentives have moved to")}
            <InlineLink
              external
              display="inline"
              href="https://merkl.angle.money/?times=active%2Cfuture%2C&phrase=RETH&chains=1%2C"
            >
              {t("Merkl")}
            </InlineLink>
            , {t("and are now claimable without staking your LP token.")}
          </p>
          <br />
          {t("Continue seeding your liquidity on PancakeSwap to accrue the rewards!")}
        </Text>
      </Box>
    </>
  );
};

const MerklNotice: React.FC = () => {
  const { tooltip, tooltipVisible, targetRef } = useTooltip(<MerklTooltip />, {
    placement: "top-start",
    tooltipOffset: [-20, 10],
    trigger: isMobile ? "focus" : "hover",
  });
  return (
    <>
      <TooltipText ref={targetRef}>
        <Text lineHeight={0}>
          <WarningIcon color="warning" />
        </Text>
      </TooltipText>
      {tooltipVisible ? tooltip : null}
    </>
  );
};

export default MerklNotice;
