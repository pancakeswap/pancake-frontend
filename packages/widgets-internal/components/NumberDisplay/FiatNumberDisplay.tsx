import BigNumber from "bignumber.js";
import { Text, useTooltip, type TextProps } from "@pancakeswap/uikit";
import { ONE, TEN, formatNumber, formatNumberWithFullDigits } from "@pancakeswap/utils/formatNumber";
import { type ReactNode, memo, useMemo, type ElementType, CSSProperties, useCallback } from "react";
import { useTranslation } from "@pancakeswap/localization";

export type FiatNumberDisplayProps = {
  fiatSymbol?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  value: string | number | BigNumber;
  maximumSignificantDigits?: number;
  showFullDigitsTooltip?: boolean;
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
  style,
  fiatSymbol = "$",
  ...props
}: FiatNumberDisplayProps) {
  const { t } = useTranslation();

  const valueWithSymbol = useCallback((val: number | string) => `${fiatSymbol} ${val}`, [fiatSymbol]);

  const valueDisplayInFullDigits = useMemo(
    () =>
      formatNumberWithFullDigits(value, {
        roundingMode,
      }),
    [value, roundingMode]
  );

  const valueDisplay = useMemo(() => {
    const bnValue = new BigNumber(value);
    const maximum = TEN.exponentiatedBy(maximumSignificantDigits).minus(1);
    const minimum = ONE.div(new BigNumber(10).exponentiatedBy(maximumSignificantDigits - 1));
    if (bnValue.eq(0)) {
      return valueWithSymbol(0);
    }
    // If less than minimum, just display <0.01
    if (bnValue.lt(minimum)) {
      return `<${valueWithSymbol("0.01")}`;
    }
    // If greater than maximum, format to shorthand
    if (bnValue.gt(maximum)) {
      const million = 1e6;
      const billion = 1e9;
      const trillion = 1e12;
      if (bnValue.isGreaterThanOrEqualTo(trillion)) {
        return `>${valueWithSymbol("999b")}`;
      }
      if (bnValue.isGreaterThanOrEqualTo(billion)) {
        return valueWithSymbol(`${bnValue.dividedBy(billion).toFixed(0, BigNumber.ROUND_DOWN)}b`);
      }
      if (bnValue.isGreaterThanOrEqualTo(million)) {
        return valueWithSymbol(`${bnValue.dividedBy(million).toFixed(0, BigNumber.ROUND_DOWN)}m`);
      }
    }
    // If less than 1, keep as many decimal digits as possible
    if (bnValue.lt(1)) {
      return `${fiatSymbol} ${formatNumber(value, {
        maximumSignificantDigits,
        roundingMode,
      })}`;
    }
    // Otherwise, keep more integers and 2 decimals
    return `${fiatSymbol} ${formatNumber(value, {
      maximumSignificantDigits,
      roundingMode,
      maxDecimalDisplayDigits: 2,
    })}`;
  }, [value, maximumSignificantDigits, roundingMode, fiatSymbol, valueWithSymbol]);
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("Exact number: %numberWithFullDigits%", { numberWithFullDigits: valueDisplayInFullDigits }),
    {
      placement: "top-end",
    }
  );
  const showTooltip = value && showFullDigitsTooltip && valueDisplay !== valueWithSymbol(valueDisplayInFullDigits);

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
