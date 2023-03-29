import { Currency, CurrencyAmount, JSBI, Price, Token, ZERO } from "@pancakeswap/sdk";
import { FeeAmount, FeeCalculator, Tick, TickMath, tickToPrice } from "@pancakeswap/v3-sdk";
import { useTranslation } from "@pancakeswap/localization";
import { useCallback, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { isPositionOutOfRange } from "@pancakeswap/utils/isPositionOutOfRange";

import { ScrollableContainer } from "../../components/RoiCalculatorModal/RoiCalculatorModal";
import { LiquidityChartRangeInput, Button, DynamicSection, Flex } from "../../components";
import { Section } from "./Section";
import { DepositAmountInput } from "./DepositAmount";
import { RangeSelector } from "./RangeSelector";
import { StakeSpan } from "./StakeSpan";
import { usePriceRange, useRangeHopCallbacks, useRoi, useAmountsByUsdValue } from "./hooks";
import { CompoundFrequency } from "./CompoundFrequency";
import { AnimatedArrow } from "./AnimationArrow";
import { RoiRate } from "./RoiRate";
import { Details } from "./Details";
import { ImpermanentLossCalculator } from "./ImpermanentLossCalculator";
import { compoundingIndexToFrequency, spanIndexToSpan } from "./constants";
import { PriceData, TickData } from "./types";
import { useMatchBreakpoints } from "../../contexts";
import { TwoColumns } from "./TwoColumns";
import { PriceChart } from "./PriceChart";

export interface RoiCalculatorPositionInfo {
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  depositAmountInUsd?: number | string;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
  amountA?: CurrencyAmount<Currency>;
  amountB?: CurrencyAmount<Currency>;
}

export type RoiCalculatorProps = {
  sqrtRatioX96?: JSBI;
  liquidity?: JSBI;
  independentAmount?: CurrencyAmount<Currency>;
  currencyA?: Currency;
  currencyB?: Currency;
  balanceA?: CurrencyAmount<Currency>;
  balanceB?: CurrencyAmount<Currency>;
  feeAmount?: FeeAmount;
  prices?: PriceData[];
  ticks?: TickData[];
  price?: Price<Token, Token>;
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
  depositAmountInUsd?: number | string;
  priceSpan?: number;
  onPriceSpanChange?: (spanIndex: number) => void;
  allowApply?: boolean;
  onApply?: (position: RoiCalculatorPositionInfo) => void;

  // Average 24h historical trading volume in USD
  volume24H?: number;
  max?: string;
  maxLabel?: string;
} & (RoiCalculatorFarmProps | RoiCalculatorLPProps);

type RoiCalculatorLPProps = {
  isFarm?: false;
};

type RoiCalculatorFarmProps = {
  isFarm: true;
  cakePrice?: string;
  cakeAprFactor?: BigNumber;
};

// Price is always price of token0
export function RoiCalculator({
  sqrtRatioX96,
  liquidity,
  depositAmountInUsd = "0",
  currencyA,
  currencyB,
  balanceA,
  balanceB,
  currencyAUsdPrice,
  currencyBUsdPrice,
  feeAmount,
  prices,
  ticks: ticksRaw,
  price,
  priceLower,
  priceUpper,
  volume24H,
  maxLabel,
  max,
  priceSpan,
  onPriceSpanChange,
  allowApply = false,
  onApply,
  ...props
}: RoiCalculatorProps) {
  const cakeAprFactor = props.isFarm && props.cakeAprFactor;

  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation();
  const [usdValue, setUsdValue] = useState(String(depositAmountInUsd));
  const [spanIndex, setSpanIndex] = useState(3);
  const [compoundOn, setCompoundOn] = useState(true);
  const [compoundIndex, setCompoundIndex] = useState(3);
  const tickCurrent = useMemo(() => sqrtRatioX96 && TickMath.getTickAtSqrtRatio(sqrtRatioX96), [sqrtRatioX96]);
  const invertPrice = useMemo(
    () => currencyA && currencyB && currencyB.wrapped.sortsBefore(currencyA.wrapped),
    [currencyA, currencyB]
  );
  const priceCurrent = useMemo<Price<Token, Token> | undefined>(() => {
    if (typeof tickCurrent !== "number" || !currencyA || !currencyB) {
      return undefined;
    }
    return invertPrice
      ? tickToPrice(currencyB.wrapped, currencyA.wrapped, tickCurrent)
      : tickToPrice(currencyA.wrapped, currencyB.wrapped, tickCurrent);
  }, [invertPrice, tickCurrent, currencyA, currencyB]);
  const ticks = useMemo(
    () =>
      ticksRaw?.map(
        ({ tick, liquidityNet }) => new Tick({ index: parseInt(tick), liquidityNet, liquidityGross: liquidityNet })
      ),
    [ticksRaw]
  );
  const mostActiveLiquidity = useMemo(
    () => ticks && sqrtRatioX96 && FeeCalculator.getLiquidityFromSqrtRatioX96(ticks, sqrtRatioX96),
    [ticks, sqrtRatioX96]
  );

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
  const { amountA, amountB } = useAmountsByUsdValue({
    usdValue,
    currencyA,
    currencyB,
    price,
    priceLower: priceRange?.priceLower,
    priceUpper: priceRange?.priceUpper,
    sqrtRatioX96,
    currencyAUsdPrice,
    currencyBUsdPrice,
  });
  const maxUsdValue = useMemo<string | undefined>(() => {
    if (max) return max;
    if (!balanceA || !balanceB || typeof currencyAUsdPrice !== "number" || typeof currencyBUsdPrice !== "number") {
      return undefined;
    }
    const maxA = parseFloat(balanceA.toExact()) * currencyAUsdPrice;
    const maxB = parseFloat(balanceA.toExact()) * currencyBUsdPrice;
    return String(Math.max(maxA, maxB));
  }, [balanceA, balanceB, currencyAUsdPrice, currencyBUsdPrice, max]);

  const [editCakePrice, setEditCakePrice] = useState<number | null>(null);

  const cakePriceDiffPercent = props.isFarm && props.cakePrice && editCakePrice && editCakePrice / +props.cakePrice;

  const derivedCakeApr = useMemo(() => {
    if (
      !currencyB ||
      !priceRange?.tickUpper ||
      !priceRange?.tickLower ||
      !sqrtRatioX96 ||
      !props.isFarm ||
      !cakeAprFactor ||
      !amountA
    ) {
      return undefined;
    }

    if (isPositionOutOfRange(tickCurrent, { tickLower: priceRange.tickLower, tickUpper: priceRange.tickUpper })) {
      return BIG_ZERO;
    }

    try {
      const positionLiquidity = FeeCalculator.getLiquidityBySingleAmount({
        amount: amountA,
        currency: currencyB,
        tickUpper: priceRange?.tickUpper,
        tickLower: priceRange?.tickLower,
        sqrtRatioX96,
      });

      const cakeApr = JSBI.greaterThan(positionLiquidity, ZERO)
        ? new BigNumber(positionLiquidity.toString()).times(cakeAprFactor).div(usdValue)
        : BIG_ZERO;

      return cakeApr;
    } catch (error) {
      console.error(error, amountA, priceRange, sqrtRatioX96);
      return undefined;
    }
  }, [currencyB, priceRange, sqrtRatioX96, props.isFarm, cakeAprFactor, amountA, tickCurrent, usdValue]);

  const editedCakeApr =
    derivedCakeApr && typeof cakePriceDiffPercent === "number"
      ? derivedCakeApr.times(cakePriceDiffPercent)
      : derivedCakeApr;

  const { fee, rate, apr, apy, cakeApy, editCakeApy, cakeRate, cakeReward } = useRoi({
    amountA,
    amountB,
    currencyAUsdPrice,
    currencyBUsdPrice,
    tickLower: priceRange?.tickLower,
    tickUpper: priceRange?.tickUpper,
    volume24H,
    sqrtRatioX96,
    mostActiveLiquidity,
    fee: feeAmount,
    compoundEvery: compoundingIndexToFrequency[compoundIndex],
    stakeFor: spanIndexToSpan[spanIndex],
    compoundOn,
    cakeApr: props.isFarm && derivedCakeApr ? derivedCakeApr.toNumber() : undefined,
    editCakeApr: props.isFarm && editedCakeApr ? editedCakeApr.toNumber() : undefined,
  });

  const handleApply = useCallback(
    () =>
      onApply?.({
        amountA,
        amountB,
        depositAmountInUsd: usdValue,
        priceLower: priceRange?.priceLower,
        priceUpper: priceRange?.priceUpper,
        currencyAUsdPrice,
        currencyBUsdPrice,
      }),
    [onApply, priceRange, amountA, amountB, usdValue, currencyAUsdPrice, currencyBUsdPrice]
  );

  const totalRate = parseFloat(rate?.toSignificant(6) ?? "0") + parseFloat(cakeRate?.toSignificant(6) ?? "0");
  const lpReward = parseFloat(fee.toSignificant(6));
  const farmReward = cakeReward;
  const totalRoi = lpReward + farmReward;

  const depositSection = (
    <Section title={t("Deposit Amount")}>
      <DepositAmountInput
        value={usdValue}
        maxLabel={maxLabel}
        onChange={setUsdValue}
        currencyA={currencyA}
        currencyB={currencyB}
        amountA={amountA}
        amountB={amountB}
        max={maxUsdValue}
      />
    </Section>
  );

  const stakeAndCompound = (
    <>
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
    </>
  );

  const priceRangeSettings = (
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
  );

  const priceChart = (
    <Section title={t("History price")}>
      <PriceChart
        prices={prices}
        onSpanChange={onPriceSpanChange}
        span={priceSpan}
        priceUpper={
          invertPrice ? priceRange?.priceLower?.invert().toSignificant(6) : priceRange?.priceUpper?.toSignificant(6)
        }
        priceLower={
          invertPrice ? priceRange?.priceUpper?.invert().toSignificant(6) : priceRange?.priceLower?.toSignificant(6)
        }
        priceCurrent={invertPrice ? priceCurrent?.invert().toSignificant(6) : priceCurrent?.toSignificant(6)}
      />
    </Section>
  );

  const content = isMobile ? (
    <>
      {depositSection}
      {priceChart}
      {priceRangeSettings}
      {stakeAndCompound}
    </>
  ) : (
    <TwoColumns>
      <Flex flexDirection="column" alignItems="flex-start">
        {depositSection}
        {priceChart}
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start">
        {stakeAndCompound}
        {priceRangeSettings}
      </Flex>
    </TwoColumns>
  );

  return (
    <>
      <ScrollableContainer>
        {content}
        <ImpermanentLossCalculator
          lpReward={lpReward}
          amountA={amountA}
          amountB={amountB}
          currencyAUsdPrice={currencyAUsdPrice}
          currencyBUsdPrice={currencyBUsdPrice}
          tickLower={priceRange?.tickLower}
          tickUpper={priceRange?.tickUpper}
          sqrtRatioX96={sqrtRatioX96}
          isFarm={props.isFarm}
          usdValue={usdValue}
          cakeApy={cakeApy}
          cakePrice={props.isFarm ? props.cakePrice : undefined}
          setEditCakePrice={setEditCakePrice}
        />
        <AnimatedArrow state={{}} />
        <RoiRate usdAmount={totalRoi} roiPercent={totalRate} />
        {allowApply && (
          <Button width="100%" mt="0.75em" onClick={handleApply}>
            {t("Apply Settings")}
          </Button>
        )}
      </ScrollableContainer>
      <Details
        totalYield={totalRoi}
        lpReward={fee.toSignificant(6)}
        lpApr={apr}
        lpApy={apy}
        compoundIndex={compoundIndex}
        compoundOn={compoundOn}
        farmApr={props.isFarm ? (editCakeApy ? editCakeApy.toFixed(2) : cakeApy?.toFixed(2)) : undefined}
        farmReward={farmReward}
        isFarm={props.isFarm}
      />
    </>
  );
}
