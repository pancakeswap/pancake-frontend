import { useTranslation } from "@pancakeswap/localization";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Currency, JSBI, Price, Token } from "@pancakeswap/sdk";
import tryParseAmount from "@pancakeswap/utils/tryParseAmount";
import { priceToClosestTick, TickMath, FeeCalculator } from "@pancakeswap/v3-sdk";

import { Section } from "./DynamicSection";
import { Toggle, Button } from "../../components";
import { AssetCard, Asset, CardSection, SectionTitle } from "./AssetCard";

interface Props {
  assets?: Asset[];
  tickLower?: number;
  tickUpper?: number;
  sqrtRatioX96?: JSBI;
}

const toToken0Price = (
  currencyA?: Currency,
  currencyB?: Currency,
  currencyAUsdPrice?: number,
  currencyBUsdPrice?: number
): Price<Token, Token> | undefined => {
  const scaler = 1_000_000_000;
  if (!currencyA || !currencyB || typeof currencyAUsdPrice !== "number" || typeof currencyBUsdPrice !== "number") {
    return undefined;
  }
  const isToken0 = currencyA.wrapped.sortsBefore(currencyB.wrapped);
  const amountA = tryParseAmount(String(scaler / currencyAUsdPrice), currencyA);
  const amountB = tryParseAmount(String(scaler / currencyBUsdPrice), currencyB);
  const [baseAmount, quoteAmount] = isToken0
    ? [amountA?.wrapped, amountB?.wrapped]
    : [amountB?.wrapped, amountA?.wrapped];
  if (!baseAmount || !quoteAmount) {
    return undefined;
  }
  return new Price({ baseAmount, quoteAmount });
};

export function ImpermanentLossCalculator({ assets, tickLower, tickUpper, sqrtRatioX96 }: Props) {
  const { t } = useTranslation();
  const [on, setOn] = useState(false);
  const [entry, setEntry] = useState<Asset[] | undefined>(assets);
  const [exit, setExit] = useState<Asset[] | undefined>(assets);
  const toggle = useCallback(() => setOn(!on), [on]);
  const resetEntry = useCallback(() => setEntry(assets), [assets]);
  const resetExit = useCallback(() => setExit(assets), [assets]);
  const principal = useMemo(
    () => entry?.reduce((total, cur) => total + cur.price * parseFloat(cur.amount.toExact()), 0) || 0,
    [entry]
  );

  const getPriceAdjustedAssets = useCallback(
    (newAssets?: Asset[]) => {
      if (
        !assets ||
        !newAssets ||
        newAssets.length < 2 ||
        typeof tickLower !== "number" ||
        typeof tickUpper !== "number" ||
        !sqrtRatioX96
      ) {
        return newAssets;
      }
      const [{ amount: amountA }, { amount: amountB }] = assets;
      const [{ price: priceA }, { price: priceB }] = newAssets;
      const token0Price = toToken0Price(amountA.currency.wrapped, amountB.currency.wrapped, priceA, priceB);
      if (!token0Price) {
        return newAssets;
      }
      const currentTick = priceToClosestTick(token0Price);
      const newSqrtRatioX96 = TickMath.getSqrtRatioAtTick(currentTick);
      const [adjustedAmountA, adjustedAmountB] = FeeCalculator.getAmountsAtNewPrice({
        sqrtRatioX96,
        newSqrtRatioX96,
        tickUpper,
        tickLower,
        amountA,
        amountB,
      });
      return [
        { price: priceA, amount: adjustedAmountA },
        { price: priceB, amount: adjustedAmountB },
      ];
    },
    [tickLower, tickUpper, sqrtRatioX96, assets]
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
            <Button variant="secondary" scale="xs" onClick={resetEntry}>
              {t("Reset")}
            </Button>
          </>
        }
      >
        <AssetCard assets={entry} onChange={updateEntry} />
      </CardSection>
      <CardSection
        header={
          <>
            <SectionTitle>{t("Exit price")}</SectionTitle>
            <Button variant="secondary" scale="xs" onClick={resetExit}>
              {t("Reset")}
            </Button>
          </>
        }
      >
        <AssetCard assets={exit} onChange={updateExit} />
      </CardSection>
      <CardSection header={<SectionTitle>{t("Projected results")}</SectionTitle>}>
        <AssetCard mb={16} showPrice={false} assets={exit} />
        <AssetCard showPrice={false} assets={exit} isActive />
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
