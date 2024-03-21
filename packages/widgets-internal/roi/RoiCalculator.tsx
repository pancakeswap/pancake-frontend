import { useTranslation } from "@pancakeswap/localization";
import { Currency, CurrencyAmount, Percent, Price, Token, ZERO } from "@pancakeswap/sdk";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { formatFraction, formatPercent, formatPrice } from "@pancakeswap/utils/formatFractions";
import { isPositionOutOfRange } from "@pancakeswap/utils/isPositionOutOfRange";
import { FeeAmount, FeeCalculator, TickMath, sqrtRatioX96ToPrice } from "@pancakeswap/v3-sdk";
import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";

import { Button, DynamicSection, Flex, useMatchBreakpoints } from "@pancakeswap/uikit";

import { ScrollableContainer } from "@pancakeswap/uikit/components/RoiCalculatorModal/RoiCalculatorModal";
import { LiquidityChartRangeInput } from "../swap/LiquidityChartRangeInput";
import { useDensityChartData } from "../swap/LiquidityChartRangeInput/hooks";
import { AnimatedArrow } from "./AnimationArrow";
import { CompoundFrequency } from "./CompoundFrequency";
import { DepositAmountInput } from "./DepositAmount";
import { Details } from "./Details";
import { FarmingRewardsToggle } from "./FarmingRewardsToggle";
import { ImpermanentLossCalculator } from "./ImpermanentLossCalculator";
import { PriceChart } from "./PriceChart";
import { PriceInvertSwitch } from "./PriceInvertSwitch";
import { RangeSelector } from "./RangeSelector";
import { RoiRate } from "./RoiRate";
import { Section } from "./Section";
import { StakeSpan } from "./StakeSpan";
import { TwoColumns } from "./TwoColumns";
import { compoundingIndexToFrequency, spanIndexToSpan } from "./constants";
import { useAmountsByUsdValue, usePriceRange, useRangeHopCallbacks, useRoi } from "./hooks";
import { TickData } from "./types";

export interface RoiCalculatorPositionInfo {
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  depositAmountInUsd?: number | string;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
  amountA?: CurrencyAmount<Currency>;
  amountB?: CurrencyAmount<Currency>;
  fullRange?: boolean;
}

export interface PriceCalculator {
  pairPriceData: {
    time: Date;
    value: number;
  }[];
  maxPrice?: number;
  minPrice?: number;
  averagePrice?: number;
}

export type RoiCalculatorProps = {
  sqrtRatioX96?: bigint;
  liquidity?: bigint;
  independentAmount?: CurrencyAmount<Currency>;
  currencyA?: Currency | null;
  currencyB?: Currency | null;
  balanceA?: CurrencyAmount<Currency>;
  balanceB?: CurrencyAmount<Currency>;
  feeAmount?: FeeAmount;
  protocolFee?: Percent;
  prices?: PriceCalculator;
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
  currencyA: originalCurrencyA,
  currencyB: originalCurrencyB,
  balanceA: originalBalanceA,
  balanceB: originalBalanceB,
  currencyAUsdPrice: originalCurrencyAUsdPrice,
  currencyBUsdPrice: originalCurrencyBUsdPrice,
  feeAmount,
  protocolFee,
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
  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation();
  const stringDepositAmount = useMemo(() => String(depositAmountInUsd), [depositAmountInUsd]);
  const [usdValue, setUsdValue] = useState(stringDepositAmount === "0" ? "100" : stringDepositAmount);
  const [spanIndex, setSpanIndex] = useState(3);
  const [compoundOn, setCompoundOn] = useState(true);
  const [compoundIndex, setCompoundIndex] = useState(3);
  const [invertBase, setInvertBase] = useState(false);
  const onSwitchBaseCurrency = useCallback(() => setInvertBase(!invertBase), [invertBase]);

  const { currencyA, currencyB, balanceA, balanceB, currencyAUsdPrice, currencyBUsdPrice } = useMemo(
    () =>
      invertBase
        ? {
            currencyA: originalCurrencyB,
            currencyB: originalCurrencyA,
            balanceA: originalBalanceB,
            balanceB: originalBalanceA,
            currencyAUsdPrice: originalCurrencyBUsdPrice,
            currencyBUsdPrice: originalCurrencyAUsdPrice,
          }
        : {
            currencyA: originalCurrencyA,
            currencyB: originalCurrencyB,
            balanceA: originalBalanceA,
            balanceB: originalBalanceB,
            currencyAUsdPrice: originalCurrencyAUsdPrice,
            currencyBUsdPrice: originalCurrencyBUsdPrice,
          },
    [
      invertBase,
      originalCurrencyA,
      originalCurrencyB,
      originalBalanceA,
      originalBalanceB,
      originalCurrencyAUsdPrice,
      originalCurrencyBUsdPrice,
    ]
  );

  const tickCurrent = useMemo(
    () => (sqrtRatioX96 ? TickMath.getTickAtSqrtRatio(sqrtRatioX96) : undefined),
    [sqrtRatioX96]
  );
  const invertPrice = useMemo(
    () => currencyA && currencyB && currencyB.wrapped.sortsBefore(currencyA.wrapped),
    [currencyA, currencyB]
  );
  const priceCurrent = useMemo(() => {
    if (!sqrtRatioX96 || !currencyA || !currencyB) {
      return undefined;
    }
    const accuratePrice = sqrtRatioX96ToPrice(sqrtRatioX96, currencyA, currencyB);

    return currencyA.wrapped.sortsBefore(currencyB.wrapped) ? accuratePrice : accuratePrice.invert();
  }, [sqrtRatioX96, currencyA, currencyB]);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editCakePrice, setEditCakePrice] = useState<number | null>(null);
  const [includeFarmingRewards, setIncludeFarmingRewards] = useState(true);
  const farmingRewardsEnabled = props.isFarm && includeFarmingRewards;
  const cakeAprFactor = farmingRewardsEnabled && props.cakeAprFactor;

  const cakePriceDiffPercent =
    farmingRewardsEnabled && props.cakePrice && editCakePrice && editCakePrice / +props.cakePrice;

  const derivedCakeApr = useMemo(() => {
    if (
      !amountA ||
      !amountB ||
      typeof priceRange?.tickUpper !== "number" ||
      typeof priceRange?.tickLower !== "number" ||
      !sqrtRatioX96 ||
      !farmingRewardsEnabled ||
      !cakeAprFactor
    ) {
      return undefined;
    }

    if (isPositionOutOfRange(tickCurrent, { tickLower: priceRange.tickLower, tickUpper: priceRange.tickUpper })) {
      return BIG_ZERO;
    }

    try {
      const positionLiquidity = FeeCalculator.getLiquidityByAmountsAndPrice({
        amountA,
        amountB,
        tickUpper: priceRange?.tickUpper,
        tickLower: priceRange?.tickLower,
        sqrtRatioX96,
      });

      if (!positionLiquidity) {
        return BIG_ZERO;
      }

      const cakeApr =
        positionLiquidity > ZERO
          ? new BigNumber(positionLiquidity.toString()).times(cakeAprFactor).div(usdValue)
          : BIG_ZERO;

      return cakeApr;
    } catch (error) {
      console.error(error, amountA, priceRange, sqrtRatioX96);
      return undefined;
    }
  }, [amountA, amountB, priceRange, sqrtRatioX96, farmingRewardsEnabled, cakeAprFactor, tickCurrent, usdValue]);

  const editedCakeApr = useMemo(
    () =>
      derivedCakeApr && typeof cakePriceDiffPercent === "number"
        ? derivedCakeApr.times(cakePriceDiffPercent)
        : derivedCakeApr,
    [cakePriceDiffPercent, derivedCakeApr]
  );

  const {
    fee,

    apr,
    apy,
    cakeApr,
    cakeApy,
    editCakeApr,
    editCakeApy,

    cakeReward,
    originalCakeReward,
    combinedApy,
    combinedReward,
    combinedRate,
  } = useRoi({
    amountA,
    amountB,
    currencyAUsdPrice,
    currencyBUsdPrice,
    tickLower: priceRange?.tickLower,
    tickUpper: priceRange?.tickUpper,
    volume24H,
    sqrtRatioX96,
    mostActiveLiquidity: liquidity,
    fee: feeAmount,
    protocolFee,
    compoundEvery: compoundingIndexToFrequency[compoundIndex],
    stakeFor: spanIndexToSpan[spanIndex],
    compoundOn,
    cakeApr: farmingRewardsEnabled && derivedCakeApr ? derivedCakeApr.toNumber() : undefined,
    editCakeApr: farmingRewardsEnabled && editedCakeApr ? editedCakeApr.toNumber() : undefined,
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
        fullRange: priceRange?.fullRange,
      }),
    [onApply, priceRange, amountA, amountB, usdValue, currencyAUsdPrice, currencyBUsdPrice]
  );

  const totalRate = useMemo(() => parseFloat(formatPercent(combinedRate, 12) ?? "0"), [combinedRate]);
  const lpReward = useMemo(() => parseFloat(formatFraction(fee, 12) ?? "0"), [fee]);
  const farmReward = cakeReward;
  const totalReward = combinedReward;

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

  const farmingRewards = props.isFarm ? (
    <Section title={t("Include farming rewards")}>
      <FarmingRewardsToggle on={includeFarmingRewards} onToggle={setIncludeFarmingRewards} />
    </Section>
  ) : null;

  const { formattedData } = useDensityChartData({
    tickCurrent,
    liquidity,
    feeAmount,
    currencyA,
    currencyB,
    ticks: ticksRaw,
  });

  const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped);
  const priceStr = isSorted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);
  const currentPrice = priceStr ? parseFloat(priceStr) : undefined;

  const priceRangeSettings = (
    <Section title={t("Set price range")}>
      <LiquidityChartRangeInput
        price={currentPrice}
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
        onBothRangeInput={priceRange?.onBothRangeInput}
        formattedData={formattedData}
      />
      <PriceInvertSwitch baseCurrency={currencyA} onSwitch={onSwitchBaseCurrency} />
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
      <PriceInvertSwitch baseCurrency={currencyA} onSwitch={onSwitchBaseCurrency} />
      <PriceChart
        prices={useMemo(
          () =>
            prices?.pairPriceData?.map((p) => ({ ...p, value: invertPrice ? p.value : p.value > 0 ? 1 / p.value : 0 })),
          [invertPrice, prices]
        )}
        onSpanChange={onPriceSpanChange}
        span={priceSpan}
        priceUpper={
          priceRange?.fullRange
            ? undefined
            : invertPrice
            ? formatPrice(priceRange?.priceLower?.invert(), 6)
            : formatPrice(priceRange?.priceUpper, 6)
        }
        priceLower={
          priceRange?.fullRange
            ? undefined
            : invertPrice
            ? formatPrice(priceRange?.priceUpper?.invert(), 6)
            : formatPrice(priceRange?.priceLower, 6)
        }
        priceCurrent={invertPrice ? formatPrice(priceCurrent?.invert(), 6) : formatPrice(priceCurrent, 6)}
        maxPrice={invertPrice && prices?.maxPrice ? prices?.maxPrice : 1 / (prices?.minPrice ?? 1)}
        minPrice={invertPrice && prices?.minPrice ? prices?.minPrice : 1 / (prices?.maxPrice ?? 1)}
        averagePrice={invertPrice && prices?.averagePrice ? prices?.averagePrice : 1 / (prices?.averagePrice ?? 1)}
      />
    </Section>
  );

  const content = isMobile ? (
    <>
      {depositSection}
      {priceChart}
      {farmingRewards}
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
        {farmingRewards}
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
          amountA={invertBase ? amountB : amountA}
          amountB={invertBase ? amountA : amountB}
          currencyAUsdPrice={invertBase ? currencyBUsdPrice : currencyAUsdPrice}
          currencyBUsdPrice={invertBase ? currencyAUsdPrice : currencyBUsdPrice}
          tickLower={priceRange?.tickLower}
          tickUpper={priceRange?.tickUpper}
          sqrtRatioX96={sqrtRatioX96}
          isFarm={farmingRewardsEnabled}
          cakeReward={originalCakeReward}
          cakePrice={farmingRewardsEnabled ? props.cakePrice : undefined}
          setEditCakePrice={setEditCakePrice}
        />
        <AnimatedArrow state={{}} />
        <RoiRate usdAmount={totalReward} roiPercent={totalRate} />
        {allowApply && (
          <Button width="100%" mt="0.75em" onClick={handleApply}>
            {t("Apply Settings")}
          </Button>
        )}
      </ScrollableContainer>
      <Details
        totalYield={totalReward}
        lpReward={lpReward}
        lpApr={apr}
        lpApy={apy}
        compoundIndex={compoundIndex}
        compoundOn={compoundOn}
        farmApr={farmingRewardsEnabled ? editCakeApr || cakeApr : undefined}
        farmApy={farmingRewardsEnabled ? editCakeApy || cakeApy : undefined}
        farmReward={farmReward}
        isFarm={farmingRewardsEnabled}
        combinedApy={combinedApy}
      />
    </>
  );
}
