import { useTranslation } from "@pancakeswap/localization";
import { useCallback, useEffect, useState, useMemo, memo } from "react";
import { Currency, CurrencyAmount, ONE_HUNDRED_PERCENT, ZERO_PERCENT } from "@pancakeswap/sdk";
import { FeeCalculator, encodeSqrtRatioX96 } from "@pancakeswap/v3-sdk";
import { styled } from "styled-components";
import { CAKE } from "@pancakeswap/tokens";
import { Box, Row, AutoColumn, Toggle, RowBetween, Message } from "@pancakeswap/uikit";
import { DoubleCurrencyLogo } from "../components/CurrencyLogo";

import { Section } from "./Section";
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
import { floatToPercent, toToken0Price } from "./utils";
import { TwoColumns } from "./TwoColumns";
import { EditableAssets } from "./EditableAssets";

const Container = styled(Box)`
  background: ${({ theme }) => theme.colors.background};
  padding: 12px;
  border-radius: 20px;
`;

interface Props {
  amountA?: CurrencyAmount<Currency>;
  amountB?: CurrencyAmount<Currency>;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
  tickLower?: number;
  tickUpper?: number;
  sqrtRatioX96?: bigint;
  lpReward?: number;
  cakeReward?: number;
  isFarm?: boolean;
  cakePrice?: string;
  setEditCakePrice: (cakePrice: number) => void;
}

const getCakeAssetsByReward = (chainId: number, cakeRewardAmount = 0, cakePrice: string) => {
  return {
    currency: CAKE[chainId as keyof typeof CAKE],
    amount: cakeRewardAmount,
    price: cakePrice,
    value: Number.isFinite(cakeRewardAmount) ? +cakeRewardAmount * +cakePrice : Infinity,
    key: "CAKE_ASSET_BY_APY",
  };
};

export const ImpermanentLossCalculator = memo(function ImpermanentLossCalculator({
  tickLower,
  tickUpper,
  sqrtRatioX96,
  amountA,
  amountB,
  currencyAUsdPrice,
  currencyBUsdPrice,
  lpReward = 0,
  cakeReward = 0,
  isFarm,
  cakePrice = "0",
  setEditCakePrice,
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
  const cakeRewardAmount = useMemo(
    () => (Number.isFinite(cakeReward) ? +cakeReward / +cakePrice : Infinity),
    [cakeReward, cakePrice]
  );
  const liquidity = useMemo(
    () =>
      amountA &&
      amountB &&
      typeof tickUpper === "number" &&
      typeof tickLower === "number" &&
      sqrtRatioX96 &&
      tickLower < tickUpper &&
      FeeCalculator.getLiquidityByAmountsAndPrice({ amountA, amountB, tickUpper, tickLower, sqrtRatioX96 }),
    [amountA, amountB, tickUpper, tickLower, sqrtRatioX96]
  );

  const exitAssets = useMemo<Asset[] | undefined>(() => {
    if (assets && isFarm && currencyA && currencyA.chainId in CAKE && cakePrice) {
      const cakePriceToUse =
        assets.find((a) => a.currency.equals(CAKE[currencyA.chainId as keyof typeof CAKE]))?.price ?? cakePrice;
      return [...assets, getCakeAssetsByReward(currencyA.chainId, cakeRewardAmount, cakePriceToUse)];
    }
    return assets;
  }, [assets, cakeRewardAmount, cakePrice, currencyA, isFarm]);

  const [entry, setEntry] = useState<Asset[] | undefined>(assets);
  const [exit, setExit] = useState<Asset[] | undefined>(exitAssets);
  const toggle = useCallback(() => setOn(!on), [on]);
  const resetEntry = useCallback(() => setEntry(assets), [assets]);
  const resetExit = useCallback(() => setExit(exitAssets), [exitAssets]);
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
    return exit?.slice(0, 2).map(({ price }, i) => ({
      ...entry[i],
      price,
      value: parseFloat(String(entry[i].amount)) * parseFloat(price),
    }));
  }, [entry, exit]);
  const hodlRate = useMemo(
    () =>
      hodlValue && principal
        ? floatToPercent(hodlValue / principal)?.subtract(ONE_HUNDRED_PERCENT) || ZERO_PERCENT
        : ZERO_PERCENT,
    [hodlValue, principal]
  );
  const exitValue = useMemo(() => {
    return (
      (exit?.reduce((sum, { price, amount }) => {
        if (
          (typeof amount === "number" && !Number.isFinite(amount)) ||
          (typeof price === "number" && !Number.isFinite(price))
        ) {
          return Infinity;
        }
        return sum + parseFloat(String(amount || 0)) * parseFloat(price);
      }, 0) || 0) + lpReward
    );
  }, [exit, lpReward]);
  const exitRate = useMemo(() => {
    if (exitValue === Infinity) return Infinity;
    return exitValue && principal
      ? floatToPercent(exitValue / principal)?.subtract(ONE_HUNDRED_PERCENT) || ZERO_PERCENT
      : ZERO_PERCENT;
  }, [exitValue, principal]);
  const lpBetter = useMemo(
    () => (exitRate === Infinity ? true : !hodlRate.greaterThan(exitRate)),
    [exitRate, hodlRate]
  );

  const isExitPriceOutOfRange = useMemo(
    () => principal && exit && exit.length >= 2 && exit.slice(0, 2).some((asset) => Number(asset.amount) === 0),
    [exit, principal]
  );

  const getPriceAdjustedAssets = useCallback(
    (newAssets?: Asset[]) => {
      if (
        !liquidity ||
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
      const [assetA, assetB, maybeAssetCake] = newAssets;
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
      const newSqrtRatioX96 = encodeSqrtRatioX96(token0Price.numerator, token0Price.denominator);
      const [adjustedAmountA, adjustedAmountB] = FeeCalculator.getAmountsByLiquidityAndPrice({
        currencyA: assetCurrencyA,
        currencyB: assetCurrencyB,
        liquidity,
        sqrtRatioX96: newSqrtRatioX96,
        tickUpper,
        tickLower,
      });

      if (!adjustedAmountA || !adjustedAmountB) {
        return newAssets;
      }
      const amountAStr = adjustedAmountA.toExact();
      const amountBStr = adjustedAmountB.toExact();
      let adjusted: Asset[] = [
        { ...assetA, amount: amountAStr, value: parseFloat(amountAStr) * parseFloat(priceA) },
        { ...assetB, amount: amountBStr, value: parseFloat(amountBStr) * parseFloat(priceB) },
      ];
      if (maybeAssetCake) {
        adjusted = [
          ...adjusted,
          {
            ...maybeAssetCake,
            ...getCakeAssetsByReward(assetCurrencyA.chainId, cakeRewardAmount, String(maybeAssetCake.price)),
          },
        ];

        setEditCakePrice(+maybeAssetCake.price);
      }

      return adjusted;
    },
    // setEditCakePrice is not a dependency because it's setState
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amountA, amountB, tickLower, tickUpper, sqrtRatioX96, cakeRewardAmount, liquidity]
  );

  const updateEntry = useCallback(
    (newEntry: Asset[]) => setEntry(getPriceAdjustedAssets(newEntry)),
    [getPriceAdjustedAssets]
  );

  const updateExit = useCallback(
    (newExit: Asset[]) => setExit(getPriceAdjustedAssets(newExit)),
    [getPriceAdjustedAssets]
  );

  const syncNewAssets = useCallback(
    (newAssets: Asset[], currentAssets?: Asset[]) =>
      // Recalculate if user has edited one of the prices
      currentAssets?.some((asset) => asset.priceChanged)
        ? getPriceAdjustedAssets(
            // Use underlaying amounts from the new liquidity and only use the price from user
            currentAssets.map((asset, i) =>
              asset.priceChanged ? { ...asset, ...newAssets[i], price: asset.price } : newAssets[i]
            )
          )
        : // If user doesn't edit any of the prices, then update the whole liquidity including token prices
          newAssets,
    [getPriceAdjustedAssets]
  );

  useEffect(() => {
    if (assets) {
      setEntry((s) => syncNewAssets(assets, s));
    }
  }, [assets, syncNewAssets]);

  useEffect(() => {
    if (exitAssets) {
      setExit((s) => syncNewAssets(exitAssets, s));
    }
  }, [exitAssets, syncNewAssets]);

  if (!assets?.length) {
    return null;
  }

  const outofRangeWarning = isExitPriceOutOfRange ? (
    <Message variant="warning">
      {t(
        "Exit price is out of the position price range. The number of estimated rewards will not account for the loss from the position being out-of-range."
      )}
    </Message>
  ) : null;

  const calculator = on ? (
    <>
      <TwoColumns>
        <AutoColumn alignSelf="stretch">
          <EditableAssets title={t("Entry price")} assets={entry} onChange={updateEntry} onReset={resetEntry} />
        </AutoColumn>
        <AutoColumn>
          <EditableAssets title={t("Exit price")} assets={exit} onChange={updateExit} onReset={resetExit} />
        </AutoColumn>
      </TwoColumns>
      <CardSection header={<SectionTitle>{t("Projected results")}</SectionTitle>}>
        <TwoColumns>
          <AutoColumn>
            <AssetCard
              isActive={!lpBetter}
              mb={24}
              showPrice={false}
              assets={hodlAssets}
              header={
                <RowBetween>
                  <InterestDisplay amount={hodlValue} interest={hodlRate} />
                  <CardTag isActive={!lpBetter}>{t("HOLD Tokens")}</CardTag>
                </RowBetween>
              }
            />
          </AutoColumn>
          <AutoColumn>
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
                      logo={<DoubleCurrencyLogo currency0={exit?.[0]?.currency} currency1={exit?.[1]?.currency} />}
                      name={t("LP Rewards")}
                    />
                  }
                  showPrice={false}
                  value={lpReward}
                />
              }
            />
          </AutoColumn>
        </TwoColumns>
      </CardSection>
      {outofRangeWarning}
    </>
  ) : null;

  return (
    <Container>
      <Section title={t("Calculate impermanent loss")} mb="0">
        <Row mb={on ? "24px" : "0px"}>
          <Toggle checked={on} onChange={toggle} scale="md" />
        </Row>
        {calculator}
      </Section>
    </Container>
  );
});
