import BigNumber from "bignumber.js";
import { Text, useTooltip, type TextProps } from "@pancakeswap/uikit";
import { formatNumber, formatNumberWithFullDigits } from "@pancakeswap/utils/formatNumber";
import { type ReactNode, memo, useMemo, type ElementType } from "react";
import { useTranslation } from "@pancakeswap/localization";

type Props = {
  prefix?: ReactNode;
  suffix?: ReactNode;
  value: string | number | BigNumber;
  maximumSignificantDigits?: number;
  showFullDigitsTooltip?: boolean;
  roundingMode?: BigNumber.RoundingMode;
  as?: ElementType;
} & TextProps;

export const NumberDisplay = memo(function NumberDisplay({
  value,
  prefix,
  suffix,
  maximumSignificantDigits = 12,
  roundingMode = BigNumber.ROUND_DOWN,
  showFullDigitsTooltip = true,
  ...props
}: Props) {
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
      formatNumber(value, {
        maximumSignificantDigits,
        roundingMode,
      }),
    [value, maximumSignificantDigits, roundingMode]
  );
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("Full digits: %numberWithFullDigits%", { numberWithFullDigits: valueDisplayInFullDigits }),
    {
      placement: "top-end",
    }
  );

  return (
    <>
      <Text ref={targetRef} style={{ textDecoration: showFullDigitsTooltip ? "underline dotted" : "none" }} {...props}>
        {prefix}
        {valueDisplay}
        {suffix}
      </Text>
      {showFullDigitsTooltip && tooltipVisible ? tooltip : null}
    </>
  );
});
