import { Currency, Price } from "@pancakeswap/sdk";
import { useTranslation } from "@pancakeswap/localization";
import { formatPrice } from "@pancakeswap/utils/formatFractions";
import { memo } from "react";

import { FlexGap } from "@pancakeswap/uikit";
import { Bound } from "../swap/LiquidityChartRangeInput";
import { StepCounter } from "./StepCounter";

// currencyA is the base token
export const RangeSelector = memo(function RangeSelector({
  priceLower,
  priceUpper,
  onLeftRangeInput = () => {
    // default
  },
  onRightRangeInput = () => {
    // default
  },
  getDecrementLower,
  getIncrementLower,
  getDecrementUpper,
  getIncrementUpper,
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
}: {
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  getDecrementLower: () => string;
  getIncrementLower: () => string;
  getDecrementUpper: () => string;
  getIncrementUpper: () => string;
  onRightRangeInput?: (typedValue: string) => void;
  onLeftRangeInput?: (typedValue: string) => void;
  currencyA?: Currency | null;
  currencyB?: Currency | null;
  feeAmount?: number;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
}) {
  const { t } = useTranslation();

  const tokenA = (currencyA ?? undefined)?.wrapped;
  const tokenB = (currencyB ?? undefined)?.wrapped;
  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB);

  const leftPrice = isSorted ? priceLower : priceUpper?.invert();
  const rightPrice = isSorted ? priceUpper : priceLower?.invert();

  return (
    <FlexGap gap="16px" width="100%" mb="16px">
      <StepCounter
        value={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ? "0" : formatPrice(leftPrice, 5) ?? ""}
        onUserInput={onLeftRangeInput}
        width="48%"
        decrement={isSorted ? getDecrementLower : getIncrementUpper}
        increment={isSorted ? getIncrementLower : getDecrementUpper}
        decrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
        incrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
        feeAmount={feeAmount}
        label={leftPrice ? `${currencyB?.symbol}` : "-"}
        title={t("Min Price")}
        tokenA={currencyA?.symbol}
        tokenB={currencyB?.symbol}
      />
      <StepCounter
        value={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ? "∞" : formatPrice(rightPrice, 5) ?? ""}
        onUserInput={onRightRangeInput}
        width="48%"
        decrement={isSorted ? getDecrementUpper : getIncrementLower}
        increment={isSorted ? getIncrementUpper : getDecrementLower}
        incrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
        decrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
        feeAmount={feeAmount}
        label={rightPrice ? `${currencyB?.symbol}` : "-"}
        tokenA={currencyA?.symbol}
        tokenB={currencyB?.symbol}
        title={t("Max Price")}
      />
    </FlexGap>
  );
});
