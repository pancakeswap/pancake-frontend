import { formatNumber } from "@pancakeswap/utils/formatNumber";
import BigNumber from "bignumber.js";
import { memo, useMemo } from "react";
import { BaseNumberDisplay } from "./BaseNumberDisplay";
import type { CommonNumberDisplayProps } from "./types";

export type NumberDisplayProps = {
  maximumSignificantDigits?: number;
  showFullDigitsTooltip?: boolean;
} & CommonNumberDisplayProps;

export const NumberDisplay = memo(function NumberDisplay({
  value,
  maximumSignificantDigits = 12,
  roundingMode = BigNumber.ROUND_DOWN,
  style,
  ...props
}: NumberDisplayProps) {
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
  return (
    <BaseNumberDisplay value={value} valueDisplay={valueDisplay} roundingMode={roundingMode} {...props} style={style} />
  );
});
