import * as Sentry from "@sentry/nextjs";
import { useTranslation } from "@pancakeswap/localization";
import { Currency, Price } from "@pancakeswap/sdk";
import { FeeAmount } from "@pancakeswap/v3-sdk";
import { format } from "d3";
import { saturate } from "polished";
import { useCallback, useMemo } from "react";
import { batch } from "react-redux";
import styled, { useTheme } from "styled-components";
import { parseNumberToFraction, formatFraction } from "@pancakeswap/utils/formatFractions";

import { InfoBox } from "./InfoBox";
import { Chart } from "./Chart";
import { useDensityChartData } from "./hooks";
import { ZoomLevels, Bound, TickDataRaw } from "./types";
import { AutoColumn } from "../Column";
import Loader from "./Loader";
import { ChartDisableIcon, LineGraphIcon } from "../Svg";
import { BunnyKnownPlaceholder } from "../BunnyKnownPlaceholder";

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOWEST]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.LOW]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.MEDIUM]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
};

const ChartWrapper = styled.div`
  position: relative;

  justify-content: center;
  align-content: center;
`;

export function LiquidityChartRangeInput({
  tickCurrent,
  liquidity,
  currencyA,
  currencyB,
  feeAmount,
  ticks,
  ticksAtLimit = {},
  price: currentPrice,
  priceLower,
  priceUpper,
  onLeftRangeInput = () => {
    // default
  },
  onRightRangeInput = () => {
    // default
  },
  interactive = true,
  isLoading,
  error,
}: {
  tickCurrent?: number;
  liquidity?: bigint;
  isLoading?: boolean;
  error?: Error;
  currencyA?: Currency;
  currencyB?: Currency;
  feeAmount?: FeeAmount;
  ticks?: TickDataRaw[];
  ticksAtLimit?: { [bound in Bound]?: boolean };
  price?: Price<Currency, Currency>;
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  onLeftRangeInput?: (typedValue: string) => void;
  onRightRangeInput?: (typedValue: string) => void;
  interactive?: boolean;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Get token color
  const tokenAColor = "#7645D9";
  const tokenBColor = "#7645D9";

  const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped);
  const priceStr = isSorted ? currentPrice?.toSignificant(6) : currentPrice?.invert()?.toSignificant(6);
  const price = priceStr && parseFloat(priceStr);

  const { formattedData } = useDensityChartData({ tickCurrent, liquidity, feeAmount, currencyA, currencyB, ticks });

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0]);
      const rightRangeValue = Number(domain[1]);

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6;
      }

      batch(() => {
        // simulate user input for auto-formatting and other validations
        if (
          (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] || mode === "handle" || mode === "reset") &&
          leftRangeValue > 0
        ) {
          const formattedLeftRangeValue = formatFraction(parseNumberToFraction(leftRangeValue, 18));
          if (formattedLeftRangeValue) {
            onLeftRangeInput(formattedLeftRangeValue);
          }
        }

        if ((!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] || mode === "reset") && rightRangeValue > 0) {
          // todo: remove this check. Upper bound for large numbers
          // sometimes fails to parse to tick.
          if (rightRangeValue < 1e35) {
            const formattedRightRangeValue = formatFraction(parseNumberToFraction(rightRangeValue, 18));
            if (formattedRightRangeValue) {
              onRightRangeInput(formattedRightRangeValue);
            }
          }
        }
      });
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit]
  );

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    return leftPrice && rightPrice
      ? [parseFloat(leftPrice?.toSignificant(6)), parseFloat(rightPrice?.toSignificant(6))]
      : undefined;
  }, [isSorted, priceLower, priceUpper]);

  const brushLabelValue = useCallback(
    (d: "w" | "e", x: number) => {
      if (!price) return "";

      if (d === "w" && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]) return "0";
      if (d === "e" && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]) return "∞";

      const percent = (x < price ? -1 : 1) * ((Math.max(x, price) - Math.min(x, price)) / price) * 100;

      return price ? `${format(Math.abs(percent) > 1 ? ".2~s" : ".2~f")(percent)}%` : "";
    },
    [isSorted, price, ticksAtLimit]
  );

  if (error) {
    Sentry.captureMessage(error.toString(), "log");
  }

  const isUninitialized = !currencyA || !currencyB || (formattedData === undefined && !isLoading);

  return (
    <AutoColumn gap="md" style={{ minHeight: "200px", width: "100%", marginBottom: "16px" }}>
      {isUninitialized ? (
        <InfoBox message={t("Your position will appear here.")} icon={<BunnyKnownPlaceholder />} />
      ) : isLoading ? (
        <InfoBox icon={<Loader size="40px" stroke={theme.colors.text} />} />
      ) : error ? (
        <InfoBox message={t("Liquidity data not available.")} icon={<ChartDisableIcon width="40px" />} />
      ) : !formattedData || formattedData.length === 0 || !price ? (
        <InfoBox message={t("There is no liquidity data.")} icon={<LineGraphIcon width="40px" />} />
      ) : (
        <ChartWrapper>
          <Chart
            data={{ series: formattedData, current: price }}
            dimensions={{ width: 400, height: 200 }}
            margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
            styles={{
              area: {
                selection: theme.colors.text,
              },
              brush: {
                handle: {
                  west: saturate(0.1, tokenAColor) ?? theme.colors.text,
                  east: saturate(0.1, tokenBColor) ?? theme.colors.text,
                },
              },
            }}
            interactive={interactive && Boolean(formattedData?.length)}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            ticksAtLimit={ticksAtLimit}
          />
        </ChartWrapper>
      )}
    </AutoColumn>
  );
}
