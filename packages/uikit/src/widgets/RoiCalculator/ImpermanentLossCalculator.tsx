import { useTranslation } from "@pancakeswap/localization";
import { useCallback, useEffect, useState, useMemo, memo } from "react";
import { Currency, CurrencyAmount, JSBI, ONE_HUNDRED_PERCENT, ZERO_PERCENT } from "@pancakeswap/sdk";
import { priceToClosestTick, TickMath, tickToPrice } from "@pancakeswap/v3-sdk";
import styled from "styled-components";
import { CAKE } from "@pancakeswap/tokens";
import { formatPrice } from "@pancakeswap/utils/formatFractions";

import { Section } from "./Section";
import { Box, Row, AutoColumn, Toggle, Button, RowBetween, DoubleCurrencyLogo, Flex } from "../../components";
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
import { getTokenAmountsFromDepositUsd, floatToPercent, toToken0Price } from "./utils";
import { TwoColumns } from "./TwoColumns";

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
  sqrtRatioX96?: JSBI;
  lpReward?: number;
  isFarm?: boolean;
  cakePrice?: string;
  cakeApy?: number;
  usdValue?: string;
  setEditCakePrice: (cakePrice: number) => void;
}

const getCakeAssetsByApy = (
  chainId: number,
  cakePrice_: string,
  cakeApy = 0,
  usdValue = "0",
  modifiedCakePrice?: string
) => {
  const cakePrice = modifiedCakePrice || cakePrice_;
  return {
    currency: CAKE[chainId as keyof typeof CAKE],
    amount: Number.isFinite(cakeApy) ? (+usdValue * cakeApy) / 100 / +cakePrice_ : Infinity,
    price: cakePrice,
    value: Number.isFinite(cakeApy) ? ((+usdValue * cakeApy) / 100) * (+cakePrice / +cakePrice_) : Infinity,
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
  isFarm,
  cakePrice = "0",
  cakeApy,
  usdValue,
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

  const exitAssets = useMemo<Asset[] | undefined>(
    () =>
      assets && isFarm && currencyA && currencyA.chainId in CAKE && cakePrice
        ? [...assets, getCakeAssetsByApy(currencyA.chainId, cakePrice, cakeApy, usdValue)]
        : assets,
    [assets, cakeApy, cakePrice, currencyA, isFarm, usdValue]
  );

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
      const currentTick = priceToClosestTick(token0Price);
      const newSqrtRatioX96 = TickMath.getSqrtRatioAtTick(currentTick);
      const priceLower = tickToPrice(assetCurrencyA.wrapped, assetCurrencyB.wrapped, tickLower);
      const priceUpper = tickToPrice(assetCurrencyA.wrapped, assetCurrencyB.wrapped, tickUpper);
      const isToken0Price = assetCurrencyA.wrapped.sortsBefore(assetCurrencyB.wrapped);
      const [adjustedAmountA, adjustedAmountB] = getTokenAmountsFromDepositUsd({
        sqrtRatioX96: newSqrtRatioX96,
        usdValue: usdValue !== undefined ? String(usdValue) : undefined,
        price: formatPrice(token0Price, 6),
        priceLower: formatPrice(isToken0Price ? priceLower : priceLower.invert(), 6),
        priceUpper: formatPrice(isToken0Price ? priceUpper : priceUpper.invert(), 6),
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
      let adjusted: Asset[] = [
        { ...assetA, amount: amountAStr, value: parseFloat(amountAStr) * parseFloat(priceA) },
        { ...assetB, amount: amountBStr, value: parseFloat(amountBStr) * parseFloat(priceB) },
      ];
      if (maybeAssetCake) {
        adjusted = [
          ...adjusted,
          getCakeAssetsByApy(assetCurrencyA.chainId, cakePrice, cakeApy, usdValue, String(maybeAssetCake.price)),
        ];

        setEditCakePrice(+maybeAssetCake.price);
      }

      return adjusted;
    },
    // setEditCakePrice is not a dependency because it's setState
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amountA, amountB, tickLower, tickUpper, sqrtRatioX96, usdValue, cakeApy, cakePrice]
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
    if (assets) {
      setEntry((s) => (s ? getPriceAdjustedAssets(s) : assets));
    }
  }, [assets, getPriceAdjustedAssets]);

  useEffect(() => {
    if (exitAssets) {
      setExit((s) => (s ? getPriceAdjustedAssets(s) : exitAssets));
    }
  }, [exitAssets, getPriceAdjustedAssets]);

  if (!assets?.length) {
    return null;
  }

  const calculator = on ? (
    <>
      <TwoColumns>
        <AutoColumn alignSelf="stretch">
          <CardSection
            header={
              <>
                <SectionTitle>{t("Entry price")}</SectionTitle>
                <Flex>
                  <Button variant="secondary" scale="xs" onClick={resetEntry} style={{ textTransform: "uppercase" }}>
                    {t("Current")}
                  </Button>
                </Flex>
              </>
            }
          >
            <AssetCard assets={entry} onChange={updateEntry} />
          </CardSection>
        </AutoColumn>
        <AutoColumn>
          <CardSection
            header={
              <>
                <SectionTitle>{t("Exit price")}</SectionTitle>
                <Flex>
                  <Button variant="secondary" scale="xs" onClick={resetExit} style={{ textTransform: "uppercase" }}>
                    {t("Current")}
                  </Button>
                </Flex>
              </>
            }
          >
            <AssetCard assets={exit} onChange={updateExit} />
          </CardSection>
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
                      logo={<DoubleCurrencyLogo currency0={exit?.[0].currency} currency1={exit?.[1].currency} />}
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
