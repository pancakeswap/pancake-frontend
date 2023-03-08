import { Currency, CurrencyAmount, JSBI, Price, Token } from "@pancakeswap/sdk";
import { FeeAmount, Tick, TickMath } from "@pancakeswap/v3-sdk";
import { useTranslation } from "@pancakeswap/localization";
import { useCallback, useMemo, useState } from "react";

import { TickDataRaw } from "../../components/LiquidityChartRangeInput/types";
import { LiquidityChartRangeInput, CurrencyInput, Box, Button } from "../../components";
import { DynamicSection, Section } from "./DynamicSection";
import { RangeSelector } from "./RangeSelector";
import { StakeSpan } from "./StakeSpan";
import { usePriceRange, useRangeHopCallbacks, useAmounts, useRoi } from "./hooks";
import { CompoundFrequency } from "./CompoundFrequency";
import { AnimatedArrow } from "./AnimationArrow";
import { RoiRate } from "./RoiRate";
import { ImpermanentLossCalculator } from "./ImpermanentLossCalculator";
import { compoundingIndexToFrequency, spanIndexToSpan } from "./constants";

interface Props {
  sqrtRatioX96?: JSBI;
  liquidity?: JSBI;
  independentAmount?: CurrencyAmount<Currency>;
  currencyA?: Currency;
  currencyB?: Currency;
  balanceA?: CurrencyAmount<Currency>;
  balanceB?: CurrencyAmount<Currency>;
  feeAmount?: FeeAmount;
  ticks?: TickDataRaw[];
  price?: Price<Token, Token>;
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;

  // Average 24h historical trading volume in USD
  volume24H?: number;
}

// Price is always price of token0
export function RoiCalculator({
  sqrtRatioX96,
  liquidity,
  independentAmount: initialIndependentAmount,
  currencyA,
  currencyB,
  balanceA,
  balanceB,
  currencyAUsdPrice,
  currencyBUsdPrice,
  feeAmount,
  ticks: ticksRaw,
  price,
  priceLower,
  priceUpper,
  volume24H,
}: Props) {
  const { t } = useTranslation();
  const [spanIndex, setSpanIndex] = useState(3);
  const [compoundOn, setCompoundOn] = useState(true);
  const [compoundIndex, setCompoundIndex] = useState(0);
  const ticks = useMemo(
    () =>
      ticksRaw?.map(
        ({ tick, liquidityNet }) =>
          new Tick({ index: parseInt(String(tick)), liquidityNet, liquidityGross: liquidityNet })
      ),
    [ticksRaw]
  );

  const tickCurrent = useMemo(() => sqrtRatioX96 && TickMath.getTickAtSqrtRatio(sqrtRatioX96), [sqrtRatioX96]);
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
  const { valueA, valueB, onChange, amountA, amountB } = useAmounts({
    independentAmount: initialIndependentAmount,
    currencyA,
    currencyB,
    tickLower: priceRange?.tickLower,
    tickUpper: priceRange?.tickUpper,
    sqrtRatioX96,
  });

  const { fee, rate } = useRoi({
    amountA,
    amountB,
    currencyAUsdPrice,
    currencyBUsdPrice,
    tickLower: priceRange?.tickLower,
    tickUpper: priceRange?.tickUpper,
    volume24H,
    sqrtRatioX96,
    ticks,
    fee: feeAmount,
    compoundEvery: compoundingIndexToFrequency[compoundIndex],
    stakeFor: spanIndexToSpan[spanIndex],
    compoundOn,
  });

  const onCurrencyAChange = useCallback((value: string) => onChange(value, currencyA), [currencyA, onChange]);
  const onCurrencyBChange = useCallback((value: string) => onChange(value, currencyB), [currencyB, onChange]);

  return (
    <>
      <Section title={t("Deposit amount")}>
        <Box mb="16px">
          <CurrencyInput
            currency={currencyA}
            value={valueA}
            onChange={onCurrencyAChange}
            balance={balanceA}
            balanceText={t("Balance: %balance%", { balance: balanceA?.toSignificant(6) || "..." })}
          />
        </Box>
        <CurrencyInput
          currency={currencyB}
          value={valueB}
          onChange={onCurrencyBChange}
          balance={balanceB}
          balanceText={t("Balance: %balance%", { balance: balanceB?.toSignificant(6) || "..." })}
        />
      </Section>
      <Section title={t("Set price range")}>
        <LiquidityChartRangeInput
          price={price}
          currencyA={currencyA}
          currencyB={currencyB}
          tickCurrent={tickCurrent}
          liquidity={liquidity}
          feeAmount={feeAmount}
          ticks={ticksRaw}
          ticksAtLimit={priceRange?.ticksAtLimit}
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
            ticksAtLimit={priceRange?.ticksAtLimit || {}}
          />
          <Button
            onClick={priceRange?.toggleFullRange}
            variant={priceRange?.fullRange ? "primary" : "secondary"}
            mb="16px"
            scale="sm"
          >
            {t("Full Range")}
          </Button>
        </DynamicSection>
      </Section>
      <Section title={t("Staked for")}>
        <StakeSpan spanIndex={spanIndex} onSpanChange={setSpanIndex} />
      </Section>
      <Section title={t("Compounding every")}>
        <CompoundFrequency
          compoundIndex={compoundIndex}
          onCompoundChange={setCompoundIndex}
          on={compoundOn}
          onToggleCompound={setCompoundOn}
        />
      </Section>
      <ImpermanentLossCalculator />
      <AnimatedArrow state={{}} />
      <RoiRate usdAmount={parseFloat(fee.toSignificant(6))} rate={rate} />
    </>
  );
}
