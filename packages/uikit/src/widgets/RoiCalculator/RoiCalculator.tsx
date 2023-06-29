import { Currency, CurrencyAmount, Price, Token, ZERO, Percent, ZERO_PERCENT } from "@pancakeswap/sdk";
import { FeeAmount, FeeCalculator, Tick, TickMath, sqrtRatioX96ToPrice } from "@pancakeswap/v3-sdk";
import { useTranslation } from "@pancakeswap/localization";
import { useCallback, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { isPositionOutOfRange } from "@pancakeswap/utils/isPositionOutOfRange";
import { formatPercent, formatFraction, formatPrice } from "@pancakeswap/utils/formatFractions";

import { ScrollableContainer } from "../../components/RoiCalculatorModal/RoiCalculatorModal";
import { LiquidityChartRangeInput, Button, DynamicSection, Flex, Message, MessageText } from "../../components";
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
import { TickData } from "./types";
import { useMatchBreakpoints } from "../../contexts";
import { TwoColumns } from "./TwoColumns";
import { PriceChart } from "./PriceChart";
import { PriceInvertSwitch } from "./PriceInvertSwitch";
import { FarmingRewardsToggle } from "./FarmingRewardsToggle";

export interface RoiCalculatorPositionInfo {
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  depositAmountInUsd?: number | string;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
  amountA?: CurrencyAmount<Currency>;
  amountB?: CurrencyAmount<Currency>;
  fullRange?: boolean;
}

export type RoiCalculatorProps = {
  sqrtRatioX96?: bigint;
  liquidity?: bigint;
  independentAmount?: CurrencyAmount<Currency>;
  currencyA?: Currency;
  currencyB?: Currency;
  balanceA?: CurrencyAmount<Currency>;
  balanceB?: CurrencyAmount<Currency>;
  feeAmount?: FeeAmount;
  protocolFee?: Percent;
  prices?: {
    pairPriceData: {
      time: Date;
      value: number;
    }[];
    maxPrice: number;
    minPrice: number;
    averagePrice: number;
  };
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

  const { fee, rate, apr, apy, cakeApr, cakeApy, editCakeApr, editCakeApy, cakeRate, cakeReward, originalCakeReward } =
    useRoi({
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

  const totalRate = useMemo(
    () => parseFloat(formatPercent(rate?.add(cakeRate || ZERO_PERCENT), 12) ?? "0"),
    [cakeRate, rate]
  );
  const lpReward = useMemo(() => parseFloat(formatFraction(fee, 12) ?? "0"), [fee]);
  const farmReward = cakeReward;
  const totalReward = lpReward + farmReward;

  const warningMessage = (
    <Message variant="warning" mb="1em">
      <MessageText>
        {t(
          "We are in the early stage of V3 deployment. Due to a lack of historical data, numbers and estimates may be inaccurate."
        )}
      </MessageText>
    </Message>
  );

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
        {warningMessage}
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
      />
    </>
  );
}
