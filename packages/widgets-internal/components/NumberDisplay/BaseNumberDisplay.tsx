import { useTranslation } from "@pancakeswap/localization";
import { Text, useTooltip } from "@pancakeswap/uikit";
import { formatNumber } from "@pancakeswap/utils/formatNumber";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import type { CommonNumberDisplayProps } from "./types";

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

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

  const fullDigitDisplay = useMemo(() => {
    if (!value) return { fullDigitValue: "", currencyCode: "" };

    const formatted = formatNumber(value, {
      roundingMode,
      maximumSignificantDigits: 12,
    });

    const formattedRaw = valueDisplay.match(/\d/)?.index;
    const currencyCode = isFiat && formattedRaw ? valueDisplay[formattedRaw - 1] : "";
    const fullDigitValue = `${currencyCode}${formatted}`;

    return { fullDigitValue, currencyCode };
  }, [value, roundingMode, isFiat, valueDisplay]);

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("Exact number: %numberWithFullDigits%", {
      numberWithFullDigits: fullDigitDisplay.fullDigitValue,
    }),
    {
      placement: "top-end",
    }
  );
  const showTooltip = value && showFullDigitsTooltip && valueDisplay !== fullDigitDisplay.fullDigitValue;

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
