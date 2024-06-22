import { useTranslation } from "@pancakeswap/localization";
import { Text, useTooltip } from "@pancakeswap/uikit";
import { formatNumber } from "@pancakeswap/utils/formatNumber";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import type { CommonNumberDisplayProps } from "./types";

export type BaseNumberDisplayProps = {
  isFiat?: boolean;
  valueDisplay: string;
} & CommonNumberDisplayProps;

export const BaseNumberDisplay = ({
  prefix,
  suffix,
  value,
  valueDisplay,
  showFullDigitsTooltip = true,
  roundingMode = BigNumber.ROUND_DOWN,
  isFiat = false,
  style,
  ...props
}: BaseNumberDisplayProps) => {
  const { t } = useTranslation();

  const tooltipVal = useMemo(() => {
    if (!value) return "";

    const options = { roundingMode, maximumSignificantDigits: 12 };
    const formatted = formatNumber(value, options);

    // extract index of 1st non interger value (currency code if exists)
    const symbolIdx = valueDisplay.match(/\d/)?.index ?? 0;
    const doesSymbolExist = Boolean(isFiat && symbolIdx > 0);
    const currencyCode = doesSymbolExist ? valueDisplay[symbolIdx - 1] : "";

    return `${currencyCode}${formatted}`;
  }, [value, roundingMode, isFiat, valueDisplay]);

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("Exact number: %numberWithFullDigits%", { numberWithFullDigits: tooltipVal }),
    {
      placement: "top-end",
    }
  );

  const showTooltip = value && showFullDigitsTooltip && valueDisplay !== tooltipVal;

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
};
