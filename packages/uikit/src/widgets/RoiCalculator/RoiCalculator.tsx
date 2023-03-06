import { Currency, JSBI, Price, Token } from "@pancakeswap/sdk";
import { FeeAmount } from "@pancakeswap/v3-sdk";

import { Bound, TickDataRaw } from "../../components/LiquidityChartRangeInput/types";
import { LiquidityChartRangeInput } from "../../components/LiquidityChartRangeInput";
import { DynamicSection } from "./DynamicSection";
import { RangeSelector } from "./RangeSelector";
import { usePriceRange, useRangeHopCallbacks } from "./hooks";

interface Props {
  tickCurrent?: number;
  liquidity?: JSBI;
  currencyA?: Currency;
  currencyB?: Currency;
  feeAmount?: FeeAmount;
  ticks?: TickDataRaw[];
  ticksAtLimit?: { [bound in Bound]?: boolean };
  price?: Price<Token, Token>;
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
}

// Price is always price of token0
export function RoiCalculator({
  tickCurrent,
  liquidity,
  currencyA,
  currencyB,
  feeAmount,
  ticks,
  ticksAtLimit = {},
  price,
  priceLower,
  priceUpper,
}: Props) {
  const priceRange = usePriceRange({
    feeAmount,
    baseCurrency: currencyA,
    quoteCurrency: currencyB,
    priceLower,
    priceUpper,
  });
  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper } = useRangeHopCallbacks(
    currencyA,
    currencyB,
    feeAmount,
    priceRange?.tickLower,
    priceRange?.tickUpper,
    tickCurrent
  );

  return (
    <>
      <LiquidityChartRangeInput
        price={price}
        currencyA={currencyA}
        currencyB={currencyB}
        tickCurrent={tickCurrent}
        liquidity={liquidity}
        feeAmount={feeAmount}
        ticks={ticks}
        ticksAtLimit={ticksAtLimit}
        priceLower={priceRange?.priceLower}
        priceUpper={priceRange?.priceUpper}
        onLeftRangeInput={priceRange?.onLeftRangeInput}
        onRightRangeInput={priceRange?.onRightRangeInput}
      />
      <DynamicSection>
        <RangeSelector
          priceLower={priceRange?.priceLower}
          priceUpper={priceRange?.priceUpper}
          getDecrementLower={getDecrementLower}
          getIncrementLower={getIncrementLower}
          getDecrementUpper={getDecrementUpper}
          getIncrementUpper={getIncrementUpper}
          onLeftRangeInput={priceRange?.onLeftRangeInput}
          onRightRangeInput={priceRange?.onRightRangeInput}
          currencyA={currencyA}
          currencyB={currencyB}
          feeAmount={feeAmount}
          ticksAtLimit={ticksAtLimit}
        />
      </DynamicSection>
    </>
  );
}
