import { memo, useMemo, CSSProperties, ReactNode } from "react";
import styled from "styled-components";
import { FlexGap, Text, useMatchBreakpoints, type TextProps } from "@pancakeswap/uikit";
import { useTranslation } from "@pancakeswap/localization";
import { useCountdown } from "@pancakeswap/hooks";

type CountdownProps = {
  targetTimestamp: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  endsDisplay?: ReactNode;
  showSeconds?: boolean;
  background?: CSSProperties["background"];
  style?: CSSProperties;
} & TextProps;

const CountdownText = styled(Text)`
  font-size: 1.125rem;
  line-height: 1.1;
  font-weight: 600;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 1.25rem;
  }
`;

const LabelText = styled(CountdownText)`
  font-size: 0.75rem;
  line-height: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 1.25rem;
    line-height: 1.1;
  }
`;

type NumberDisplayProps = {
  label: string;
  value?: number;
} & TextProps;

function NumberDisplay({ label, value, ...props }: NumberDisplayProps) {
  const valueDisplay = useMemo(() => (value === undefined ? "00" : String(value).padStart(2, "0")), [value]);

  return (
    <CountdownText fontFamily="Inter, Sans-Serif" {...props}>
      {valueDisplay}
      {label}
    </CountdownText>
  );
}

function TimeSeparator(props: TextProps) {
  return <CountdownText {...props}>:</CountdownText>;
}

const CountdownContainer = styled(FlexGap)<{ $background?: CSSProperties["background"] }>`
  display: inline-flex;
  border-radius: 0.5rem;
  background: ${(props) => props.$background};
  padding: 0.5rem;
  align-self: flex-start;
`;

export const BannerCountdown = memo(function Countdown({
  targetTimestamp,
  background,
  style,
  showSeconds = true,
  prefix,
  suffix,
  endsDisplay,
  ...textProps
}: CountdownProps) {
  const { t } = useTranslation();
  const countdown = useCountdown(targetTimestamp);
  const { isMobile } = useMatchBreakpoints();

  if (!countdown && !endsDisplay) {
    return null;
  }

  return (
    <CountdownContainer gap="0.25rem" style={style} $background={background}>
      {prefix}
      {countdown ? (
        <FlexGap gap={isMobile ? "0.125rem" : "0.5rem"} flexDirection={isMobile ? "column" : "row"}>
          <LabelText {...textProps}>{t("Starts in")}</LabelText>
          <FlexGap gap="0.25rem">
            <NumberDisplay value={countdown?.days} label={t("d")} {...textProps} />
            <TimeSeparator {...textProps} />
            <NumberDisplay value={countdown?.hours} label={t("h")} {...textProps} />
            <TimeSeparator />
            <NumberDisplay value={countdown?.minutes} label={t("m")} {...textProps} />
            {showSeconds ? (
              <>
                <TimeSeparator {...textProps} />
                <NumberDisplay value={countdown?.seconds} label={t("s")} {...textProps} />
              </>
            ) : null}
          </FlexGap>
        </FlexGap>
      ) : (
        <CountdownText {...textProps}>{endsDisplay}</CountdownText>
      )}
      {suffix}
    </CountdownContainer>
  );
});
