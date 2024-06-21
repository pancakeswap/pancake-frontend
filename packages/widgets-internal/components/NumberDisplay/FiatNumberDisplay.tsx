import { useTranslation } from "@pancakeswap/localization";
import { formatFiatNumber } from "@pancakeswap/utils/formatNumber";
import { memo, useMemo } from "react";
import { BaseNumberDisplay } from "./BaseNumberDisplay";
import type { CommonNumberDisplayProps } from "./types";

export type FiatNumberDisplayProps = {
  showFullDigitsTooltip?: boolean;
  currencyCode: string;
  useFullDigits?: boolean;
  groupSize?: number;
  currencyFormatOptions?: Omit<
    Intl.NumberFormatOptions,
    "currency" | "style" | "minimumFractionDigits" | "maximumFractionDigits"
  >;
} & CommonNumberDisplayProps;

export const FiatNumberDisplay = memo(function FiatNumberDisplay({
  value,
  currencyCode,
  useFullDigits = false,
  groupSize = 3,
  currencyFormatOptions = {},
  style,
  ...props
}: FiatNumberDisplayProps) {
  const {
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
          groupSize,
        })
      : "";
  }, [value, currencyFormatOptions, useFullDigits, currencyCode, locale, groupSize]);

  const valueDisplayInFullDigits = useMemo(() => {
    return value
      ? formatFiatNumber({
          value,
          locale,
          useFullDigits: true,
          fiatCurrencyCode: currencyCode,
          options: currencyFormatOptions,
          groupSize,
        })
      : "";
  }, [value, currencyCode, currencyFormatOptions, locale, groupSize]);

  return (
    <BaseNumberDisplay
      value={value}
      valueDisplay={valueDisplay}
      valueDisplayInFullDigits={valueDisplayInFullDigits}
      {...props}
      style={style}
    />
  );
});
