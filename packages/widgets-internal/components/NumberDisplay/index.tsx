import { useTranslation } from "@pancakeswap/localization";
import { Text, useTooltip, type TextProps } from "@pancakeswap/uikit";
import { formatNumber, formatNumberWithFullDigits } from "@pancakeswap/utils/formatNumber";
import BigNumber from "bignumber.js";
import { memo, useMemo, type CSSProperties, type ElementType, type ReactNode } from "react";

export type FiatNumberTypeOptions = {
  fiatCurrencyCode: string;
  options?: Omit<Intl.NumberFormatOptions, "currency" | "style" | "minimumFractionDigits" | "maximumFractionDigits">;
};

export type NumberDisplayProps = {
  prefix?: ReactNode;
  suffix?: ReactNode;
  value?: string | number | BigNumber;
  maximumSignificantDigits?: number;
  showFullDigitsTooltip?: boolean;
  roundingMode?: BigNumber.RoundingMode;
  fiatCurrencyOptions?: FiatNumberTypeOptions;
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
  fiatCurrencyOptions = undefined, // handle currency by defaulting to number.toLocalString
  style,
  ...props
}: NumberDisplayProps) {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation();

  const valueDisplay = useMemo(() => {
    if (typeof fiatCurrencyOptions === "object" && "fiatCurrencyCode" in fiatCurrencyOptions) {
      let numberString: number | undefined;
      if (typeof value === "number") {
        numberString = value;
      } else {
        const baseString = Number.parseFloat(Number(value).toFixed(maximumSignificantDigits) ?? "");
        numberString = baseString;
      }

      const formattedNumber = numberString.toLocaleString(locale, {
        ...fiatCurrencyOptions.options,
        style: "currency",
        currency: fiatCurrencyOptions.fiatCurrencyCode.toUpperCase(),
        minimumFractionDigits: 2, // for fiat no need for more than 2 decimals,
        maximumFractionDigits: 2, // for fiat no need for more than 2 decimals,
      });

      const parts = extractCurrencyAndNumberParts(formattedNumber);

      if (parts) {
        const [, currencySymbol, numberPart] = parts as string[];
        const numericValue = Number.parseFloat(numberPart.replace(/,/g, ""));
        const greaterThanDisplay = numericValue > 10_000 ? ">" : "";
        const formattedValue = formatNumericValue(numericValue);

        return `${greaterThanDisplay}${currencySymbol}${formattedValue}`;
      }

      return formattedNumber;
    }

    return value
      ? formatNumber(value, {
          maximumSignificantDigits,
          roundingMode,
        })
      : "";
  }, [value, fiatCurrencyOptions, maximumSignificantDigits, roundingMode, locale]);

  const valueDisplayInFullDigits = useMemo(
    () =>
      value
        ? formatNumberWithFullDigits(value, {
            roundingMode,
          })
        : "",
    [value, roundingMode]
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

function extractCurrencyAndNumberParts(formattedNumber: string) {
  const match = formattedNumber.match(/^(\D*)(\d.*)$/);
  return match ? [undefined, match[1], match[2]] : undefined;
}

function formatNumericValue(numericValue: number): string {
  let formattedValue = numericValue.toString();

  if (numericValue > 10_000) {
    formattedValue = `${(numericValue / 1000).toFixed(0)}K`;
  }
  if (numericValue > 1_000_000) {
    formattedValue = `${(numericValue / 10_000_000).toFixed(0)}M`;
  }

  return formattedValue;
}
