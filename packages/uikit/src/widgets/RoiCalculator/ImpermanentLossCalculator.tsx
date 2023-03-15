import { useTranslation } from "@pancakeswap/localization";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Currency, CurrencyAmount, JSBI, ONE_HUNDRED_PERCENT, ZERO_PERCENT } from "@pancakeswap/sdk";
import { priceToClosestTick, TickMath, tickToPrice } from "@pancakeswap/v3-sdk";

import { Section } from "./DynamicSection";
import { Toggle, Button, RowBetween, DoubleCurrencyLogo, PencilIcon, Flex } from "../../components";
import {
  AssetCard,
  Asset,
  CardSection,
  SectionTitle,
  InterestDisplay,
  AssetRow,
  CurrencyLogoDisplay,
  CardTag,
} from "./AssetCard";
import { getTokenAmountsFromDepositUsd, toPercent, toToken0Price } from "./utils";

interface Props {
  amountA?: CurrencyAmount<Currency>;
  amountB?: CurrencyAmount<Currency>;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
  tickLower?: number;
  tickUpper?: number;
  sqrtRatioX96?: JSBI;
  lpReward?: number;
}

export function ImpermanentLossCalculator({
  tickLower,
  tickUpper,
  sqrtRatioX96,
  amountA,
  amountB,
  currencyAUsdPrice,
  currencyBUsdPrice,
  lpReward = 0,
}: Props) {
  const { t } = useTranslation();
  const [on, setOn] = useState(false);
  const currencyA = amountA?.currency;
  const currencyB = amountB?.currency;
  const valueA = amountA?.toExact();
  const valueB = amountB?.toExact();
  const assets = useMemo<Asset[] | undefined>(
    () =>
      currencyA && currencyB && valueA && valueB && currencyAUsdPrice && currencyBUsdPrice
        ? [
            {
              currency: currencyA,
              amount: valueA,
              price: String(currencyAUsdPrice),
              value: parseFloat(valueA) * currencyAUsdPrice,
            },
            {
              currency: currencyB,
              amount: valueB,
              price: String(currencyBUsdPrice),
              value: parseFloat(valueB) * currencyBUsdPrice,
            },
          ]
        : undefined,
    [valueA, currencyA, valueB, currencyB, currencyAUsdPrice, currencyBUsdPrice]
  );
  const totalUsdDeposit = useMemo(
    () => assets?.reduce((sum, { value }) => sum + parseFloat(String(value)), 0),
    [assets]
  );

  const [entry, setEntry] = useState<Asset[] | undefined>(assets);
  const [exit, setExit] = useState<Asset[] | undefined>(assets);
  const toggle = useCallback(() => setOn(!on), [on]);
  const resetEntry = useCallback(() => setEntry(assets), [assets]);
  const resetExit = useCallback(() => setExit(assets), [assets]);
  const principal = useMemo(() => entry?.reduce((sum, { value }) => sum + parseFloat(String(value)), 0), [entry]);
  const hodlValue = useMemo(() => {
    if (!entry || !exit) {
      return 0;
    }
    return exit.reduce((sum, { price }, i) => sum + parseFloat(String(entry[i]?.amount || 0)) * parseFloat(price), 0);
  }, [entry, exit]);
  const hodlAssets = useMemo<Asset[] | undefined>(() => {
    if (!entry || !exit) {
      return undefined;
    }
    return exit.map(({ price }, i) => ({
      ...entry[i],
      price,
      value: parseFloat(String(entry[i].amount)) * parseFloat(price),
    }));
  }, [entry, exit]);
  const hodlRate = useMemo(
    () => (hodlValue && principal ? toPercent(hodlValue, principal).subtract(ONE_HUNDRED_PERCENT) : ZERO_PERCENT),
    [hodlValue, principal]
  );
  const exitValue = useMemo(() => {
    return (
      (exit?.reduce((sum, { price, amount }) => sum + parseFloat(String(amount || 0)) * parseFloat(price), 0) || 0) +
      lpReward
    );
  }, [exit, lpReward]);
  const exitRate = useMemo(
    () => (exitValue && principal ? toPercent(exitValue, principal).subtract(ONE_HUNDRED_PERCENT) : ZERO_PERCENT),
    [exitValue, principal]
  );
  const lpBetter = useMemo(() => !hodlRate.greaterThan(exitRate), [exitRate, hodlRate]);

  const getPriceAdjustedAssets = useCallback(
    (newAssets?: Asset[]) => {
      if (
        !amountA ||
        !amountB ||
        !newAssets ||
        newAssets.length < 2 ||
        typeof tickLower !== "number" ||
        typeof tickUpper !== "number" ||
        !sqrtRatioX96
      ) {
        return newAssets;
      }
      const [assetA, assetB] = newAssets;
      const { price: priceA, currency: assetCurrencyA } = assetA;
      const { price: priceB, currency: assetCurrencyB } = assetB;
      const token0Price = toToken0Price(
        amountA.currency.wrapped,
        amountB.currency.wrapped,
        parseFloat(priceA),
        parseFloat(priceB)
      );
      if (!token0Price) {
        return newAssets;
      }
      const currentTick = priceToClosestTick(token0Price);
      const newSqrtRatioX96 = TickMath.getSqrtRatioAtTick(currentTick);
      const priceLower = tickToPrice(assetCurrencyA.wrapped, assetCurrencyB.wrapped, tickLower);
      const priceUpper = tickToPrice(assetCurrencyA.wrapped, assetCurrencyB.wrapped, tickUpper);
      const [adjustedAmountA, adjustedAmountB] = getTokenAmountsFromDepositUsd({
        sqrtRatioX96: newSqrtRatioX96,
        usdValue: totalUsdDeposit !== undefined ? String(totalUsdDeposit) : undefined,
        price: token0Price.toFixed(6),
        priceLower: priceLower.toFixed(6),
        priceUpper: priceUpper.toFixed(6),
        currencyA: assetCurrencyA,
        currencyB: assetCurrencyB,
        currencyAUsdPrice: parseFloat(priceA),
        currencyBUsdPrice: parseFloat(priceB),
      });
      if (!adjustedAmountA || !adjustedAmountB) {
        return newAssets;
      }
      const amountAStr = adjustedAmountA.toExact();
      const amountBStr = adjustedAmountB.toExact();
      return [
        { ...assetA, amount: amountAStr, value: parseFloat(amountAStr) * parseFloat(priceA) },
        { ...assetB, amount: amountBStr, value: parseFloat(amountBStr) * parseFloat(priceB) },
      ];
    },
    [tickLower, tickUpper, sqrtRatioX96, amountA, amountB, totalUsdDeposit]
  );

  const updateEntry = useCallback(
    (newEntry: Asset[]) => setEntry(getPriceAdjustedAssets(newEntry)),
    [getPriceAdjustedAssets]
  );

  const updateExit = useCallback(
    (newExit: Asset[]) => setExit(getPriceAdjustedAssets(newExit)),
    [getPriceAdjustedAssets]
  );

  useEffect(() => {
    setEntry(assets);
    setExit(assets);
  }, [assets]);

  if (!assets?.length) {
    return null;
  }

  const calculator = on ? (
    <>
      <CardSection
        mt={16}
        header={
          <>
            <SectionTitle>{t("Entry price")}</SectionTitle>
            <Flex>
              <PencilIcon width="12px" color="primary" mr="0.5em" />
              <Button variant="secondary" scale="xs" onClick={resetEntry} style={{ textTransform: "uppercase" }}>
                {t("Current")}
              </Button>
            </Flex>
          </>
        }
      >
        <AssetCard assets={entry} onChange={updateEntry} />
      </CardSection>
      <CardSection
        header={
          <>
            <SectionTitle>{t("Exit price")}</SectionTitle>
            <Flex>
              <PencilIcon width="12px" color="primary" mr="0.5em" />
              <Button variant="secondary" scale="xs" onClick={resetExit} style={{ textTransform: "uppercase" }}>
                {t("Current")}
              </Button>
            </Flex>
          </>
        }
      >
        <AssetCard assets={exit} onChange={updateExit} />
      </CardSection>
      <CardSection header={<SectionTitle>{t("Projected results")}</SectionTitle>}>
        <AssetCard
          isActive={!lpBetter}
          mb={24}
          showPrice={false}
          assets={hodlAssets}
          header={
            <RowBetween>
              <InterestDisplay amount={hodlValue} interest={hodlRate} />
              <CardTag isActive={!lpBetter}>{t("HODL Tokens")}</CardTag>
            </RowBetween>
          }
        />
        <AssetCard
          isActive={lpBetter}
          showPrice={false}
          assets={exit}
          header={
            <RowBetween>
              <InterestDisplay amount={exitValue} interest={exitRate} />
              <CardTag isActive={lpBetter}>{t("Provide Liquidity")}</CardTag>
            </RowBetween>
          }
          extraRows={
            <AssetRow
              name={
                <CurrencyLogoDisplay
                  logo={<DoubleCurrencyLogo currency0={exit?.[0].currency} currency1={exit?.[1].currency} />}
                  name={t("LP Rewards")}
                />
              }
              showPrice={false}
              value={lpReward}
            />
          }
        />
      </CardSection>
    </>
  ) : null;

  return (
    <Section title={t("Calculate impermanent loss")}>
      <Toggle checked={on} onChange={toggle} scale="md" />
      {calculator}
    </Section>
  );
}
