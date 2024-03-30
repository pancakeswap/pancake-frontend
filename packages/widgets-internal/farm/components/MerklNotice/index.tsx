import { useTranslation } from "@pancakeswap/localization";
import { Box, InfoFilledIcon, LinkExternal, Placement, Text, TooltipText, useTooltip } from "@pancakeswap/uikit";
import { useQuery } from "@tanstack/react-query";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Address } from "viem";

const InlineLink = styled(LinkExternal)`
  display: inline-flex;
  margin-left: 4px;
`;

type MerklNoticeContentProps = {
  linkColor?: string;
  merklLink: string;
  hasFarm?: boolean;
  chainId?: number;
  lpAddress?: Address;
};

export const MerklNoticeContent: React.FC<MerklNoticeContentProps> = ({
  linkColor = "primary",
  merklLink,
  hasFarm,
  chainId,
  lpAddress,
}) => {
  const { t } = useTranslation();

  const { data } = useQuery({
    queryKey: ["merklAprData", chainId, lpAddress],
    queryFn: async () => {
      try {
        const resp = await (
          await fetch(`https://api.angle.money/v2/merkl?chainIds[]=${chainId}&AMMs[]=pancakeswapv3`)
        ).json();
        return resp;
      } catch (error) {
        console.error("Fetch merklAprData Error: ", error);
        return true;
      }
    },
    enabled: Boolean(chainId) && Boolean(lpAddress),
  });

  const merklAPR = data?.[chainId ?? 0]?.pools?.[lpAddress ?? ""]?.aprs?.["Average APR (rewards / pool TVL)"] as
    | number
    | undefined;

  if (hasFarm) {
    return (
      <>
        <Box>
          <Text display="inline" color="currentColor">
            {t("Incentives can be earned on either Merkl or Farm but NOT both")}
            <br />
            <br />
            <p>
              {t(
                "To earn Merkl rewards, continue seeding liquidity on PancakeSwap but DO NOT stake your LP token in the Farm. Claim your rewards directly on "
              )}
              <InlineLink color={linkColor} external display="inline" href={merklLink}>
                {t("Merkl")}
              </InlineLink>
            </p>
            <br />
            {merklAPR && (
              <>
                {t("Merkl APR")}: {merklAPR?.toFixed(2)}%
              </>
            )}
            <br />
            <br />
            {t("To earn Farm rewards, continue seeding liquidity on PancakeSwap and stake your LP token in the Farm.")}
          </Text>
        </Box>
      </>
    );
  }
  return (
    <>
      <Box>
        <Text display="inline" color="currentColor">
          <p>
            {t("Incentives have moved to")}
            <InlineLink color={linkColor} external display="inline" href={merklLink}>
              {t("Merkl")}
            </InlineLink>
          </p>
          {merklAPR && (
            <>
              {t("Merkl APR")}: {merklAPR?.toFixed(2)}%
            </>
          )}
          <br />
          <br />
          <br />
          {t(
            "To earn Merkl rewards, continue seeding liquidity on PancakeSwap, but DO NOT stake your LP token in the Farm. Otherwise, you will not accrue rewards."
          )}
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
  merklLink: string;
  hasFarm?: boolean;
  chainId?: number;
  lpAddress?: Address;
};

const MerklNotice: React.FC<MerklNoticeProps> = ({
  size = "20px",
  placement = "top-start",
  tooltipOffset = [-20, 10],
  merklLink,
  hasFarm,
  chainId,
  lpAddress,
}) => {
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <MerklNoticeContent merklLink={merklLink} hasFarm={hasFarm} chainId={chainId} lpAddress={lpAddress} />,
    {
      placement,
      tooltipOffset,
      trigger: isMobile ? "focus" : "hover",
    }
  );

  return (
    <>
      <TooltipText ref={targetRef} display="inline">
        <Text lineHeight={0}>
          <InfoFilledIcon color="#6532CD" width={size} height={size} />
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
