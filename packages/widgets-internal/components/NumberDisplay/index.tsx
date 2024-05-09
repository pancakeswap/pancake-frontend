import BigNumber from "bignumber.js";
import { Text, useTooltip, type TextProps } from "@pancakeswap/uikit";
import { formatNumber, formatNumberWithFullDigits } from "@pancakeswap/utils/formatNumber";
import { type ReactNode, memo, useMemo, type ElementType, CSSProperties } from "react";
import { useTranslation } from "@pancakeswap/localization";

export type NumberDisplayProps = {
  prefix?: ReactNode;
  suffix?: ReactNode;
  value?: string | number | BigNumber;
  maximumSignificantDigits?: number;
  showFullDigitsTooltip?: boolean;
  roundingMode?: BigNumber.RoundingMode;
  as?: ElementType;
  style?: CSSProperties;
} & TextProps;

export const NumberDisplay = memo(function NumberDisplay({
  value,
  prefix,
  suffix,
  maximumSignificantDigits = 12,
  roundingMode = BigNumber.ROUND_DOWN,
  showFullDigitsTooltip = true,
  style,
  ...props
}: NumberDisplayProps) {
  const { t } = useTranslation();

  const valueDisplayInFullDigits = useMemo(
    () =>
      value
        ? formatNumberWithFullDigits(value, {
            roundingMode,
          })
        : "",
    [value, roundingMode]
  );
  const valueDisplay = useMemo(
    () =>
      value
        ? formatNumber(value, {
            maximumSignificantDigits,
            roundingMode,
          })
        : "",
    [value, maximumSignificantDigits, roundingMode]
  );
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("Exact number: %numberWithFullDigits%", { numberWithFullDigits: valueDisplayInFullDigits }),
    {
      placement: "top-end",
    }
  );
  const showTooltip = value && showFullDigitsTooltip && valueDisplay !== valueDisplayInFullDigits;

  return (
    <>
      <Text ref={targetRef} style={{ textDecoration: showTooltip ? "underline dotted" : "none", ...style }} {...props}>
        {prefix}
        {valueDisplay}
        {suffix}
      </Text>
      {showTooltip && tooltipVisible ? tooltip : null}
    </>
  );
});
