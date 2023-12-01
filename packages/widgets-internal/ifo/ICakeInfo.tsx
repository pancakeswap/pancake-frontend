import { ReactNode, useMemo } from "react";
import { FlexGap, Text, useTooltip } from "@pancakeswap/uikit";
import { SpaceProps } from "styled-system";
import { useTranslation } from "@pancakeswap/localization";
import styled from "styled-components";
import dayjs from "dayjs";

type Props = {
  // Unix timestamp of the snapshot
  snapshot?: number;

  // Ratio applied to veCAKE when calculating iCAKE
  ratio?: number;
};

const StyledText = styled(Text)<{ underline?: boolean }>`
  text-decoration: ${({ underline }) => (underline ? "underline dotted" : "none")};
  cursor: ${({ underline }) => (underline ? "help" : "text")};
`;

function InfoItem({ label, value, labelTooltip }: { label?: ReactNode; value?: ReactNode; labelTooltip?: ReactNode }) {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(labelTooltip, { placement: "top-start" });

  return (
    <FlexGap justifyContent="space-between" alignItems="center" gap="0.5rem">
      <StyledText fontSize="0.875rem" color="textSubtle" ref={targetRef} underline={!!labelTooltip}>
        {tooltipVisible && tooltip}
        {label}
      </StyledText>
      <Text fontSize="1rem" color="text">
        {value}
      </Text>
    </FlexGap>
  );
}

export function ICakeInfo({ snapshot, ratio = 1, ...props }: Props & SpaceProps) {
  const { t } = useTranslation();
  const timeDisplay = useMemo(() => snapshot && dayjs.unix(snapshot).format("MMM DD YYYY HH:mm"), [snapshot]);

  return (
    <FlexGap flexDirection="column" gap="0.5rem" {...props}>
      <InfoItem
        label={t("Snapshot at")}
        value={timeDisplay}
        labelTooltip={t("The displayed iCAKE is calculated based on this snapshot time.")}
      />
      <InfoItem
        label={t("Ratio")}
        value={`${ratio}x`}
        labelTooltip={t(
          "Your iCAKE is calculated by applying this ratio on the number of veCAKE at the snapshot time."
        )}
      />
    </FlexGap>
  );
}
