import { useTranslation } from "@pancakeswap/localization";
import { Text, useTooltip, type TextProps } from "@pancakeswap/uikit";
import { formatFiatNumber } from "@pancakeswap/utils/formatNumber";
import type BigNumber from "bignumber.js";
import { memo, useMemo, type CSSProperties, type ElementType, type ReactNode } from "react";

export type FiatNumberDisplayProps = {
  prefix?: ReactNode;
  suffix?: ReactNode;
  value?: string | number | BigNumber;
  showFullDigitsTooltip?: boolean;
  currencyCode: string;
  useFullDigits?: boolean;
  currencyFormatOptions?: Omit<
    Intl.NumberFormatOptions,
    "currency" | "style" | "minimumFractionDigits" | "maximumFractionDigits"
  >;
  as?: ElementType;
  style?: CSSProperties;
} & TextProps;

export const FiatNumberDisplay = memo(function NumberDisplay({
  value,
  prefix,
  suffix,
  showFullDigitsTooltip = true,
  currencyCode,
  useFullDigits = false,
  currencyFormatOptions = {},
  style,
  ...props
}: FiatNumberDisplayProps) {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation();

  const valueDisplay = useMemo(() => {
    return value
      ? formatFiatNumber({
          value,
          locale,
          useFullDigits,
          fiatCurrencyCode: currencyCode,
          options: currencyFormatOptions,
        })
      : "";
  }, [value, currencyFormatOptions, useFullDigits, currencyCode, locale]);

  const valueDisplayInFullDigits = useMemo(() => {
    return value
      ? formatFiatNumber({
          value,
          locale,
          useFullDigits: true,
          fiatCurrencyCode: currencyCode,
          options: currencyFormatOptions,
        })
      : "";
  }, [value, currencyCode, currencyFormatOptions, locale]);

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("Exact Value: %numberWithFullDigits%", { numberWithFullDigits: valueDisplayInFullDigits }),
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
