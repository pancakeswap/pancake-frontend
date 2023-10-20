import { useTranslation } from "@pancakeswap/localization";
import { Box, Link, Placement, Text, TooltipText, WarningIcon, useTooltip } from "@pancakeswap/uikit";
import { isMobile } from "react-device-detect";
import styled from "styled-components";

const InlineLink = styled(Link)`
  display: inline;
  margin-left: 4px;
`;

type MerklNoticeContentProps = {
  linkColor?: string;
};

export const MerklNoticeContent: React.FC<MerklNoticeContentProps> = ({ linkColor = "primary" }) => {
  const { t } = useTranslation();
  return (
    <>
      <Box>
        <Text display="inline" color="currentColor">
          <p>
            {t("Incentives have moved to")}
            <InlineLink
              color={linkColor}
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

type MerklNoticeProps = {
  // warning icon width/height px
  size?: string;
  placement?: Placement;
  tooltipOffset?: [number, number];
};

const MerklNotice: React.FC<MerklNoticeProps> = ({
  size = "20px",
  placement = "top-start",
  tooltipOffset = [-20, 10],
}) => {
  const { tooltip, tooltipVisible, targetRef } = useTooltip(<MerklNoticeContent />, {
    placement,
    tooltipOffset,
    trigger: isMobile ? "focus" : "hover",
  });
  return (
    <>
      <TooltipText ref={targetRef} display="inline">
        <Text lineHeight={0}>
          <WarningIcon color="warning" width={size} height={size} />
        </Text>
      </TooltipText>
      {tooltipVisible ? tooltip : null}
    </>
  );
};

export default {
  WithTooltip: MerklNotice,
  Content: MerklNoticeContent,
};
