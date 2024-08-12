import BigNumber from "bignumber.js";
import { Text, useTooltip, type TextProps } from "@pancakeswap/uikit";
import { formatNumberWithFullDigits } from "@pancakeswap/utils/formatNumber";
import { formatFiatNumber, valueWithSymbol } from "@pancakeswap/utils/formatFiatNumber";
import { type ReactNode, memo, useMemo, type ElementType, CSSProperties } from "react";
import { useTranslation } from "@pancakeswap/localization";

export type FiatNumberDisplayProps = {
  fiatSymbol?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  value: string | number | BigNumber;
  maximumSignificantDigits?: number;
  showFullDigitsTooltip?: boolean;
  tooltipText?: React.ReactNode;
  roundingMode?: BigNumber.RoundingMode;
  as?: ElementType;
  style?: CSSProperties;
} & TextProps;

export const FiatNumberDisplay = memo(function FiatNumberDisplay({
  value,
  prefix,
  suffix,
  maximumSignificantDigits = 8,
  roundingMode = BigNumber.ROUND_DOWN,
  showFullDigitsTooltip = true,
  tooltipText,
  style,
  fiatSymbol = "$",
  ...props
}: FiatNumberDisplayProps) {
  const { t } = useTranslation();

  const valueDisplayInFullDigits = useMemo(
    () =>
      formatNumberWithFullDigits(value, {
        roundingMode,
      }),
    [value, roundingMode]
  );

  const valueDisplay = useMemo(
    () =>
      formatFiatNumber(value, fiatSymbol, {
        roundingMode,
        maximumSignificantDigits,
      }),
    [value, maximumSignificantDigits, roundingMode, fiatSymbol]
  );

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    tooltipText ?? t("Exact number: %numberWithFullDigits%", { numberWithFullDigits: valueDisplayInFullDigits }),
    {
      placement: "top-end",
    }
  );
  const showTooltip =
    value && showFullDigitsTooltip && valueDisplay !== valueWithSymbol(valueDisplayInFullDigits, fiatSymbol);

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
