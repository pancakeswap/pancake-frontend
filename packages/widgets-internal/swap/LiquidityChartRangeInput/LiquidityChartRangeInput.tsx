import { useTranslation } from "@pancakeswap/localization";
import { Currency, Price } from "@pancakeswap/swap-sdk-core";
import { AutoColumn, BunnyKnownPlaceholder, ChartDisableIcon, LineGraphIcon } from "@pancakeswap/uikit";
import { FeeAmount } from "@pancakeswap/v3-sdk";
import * as Sentry from "@sentry/nextjs";
import { format } from "d3";
import { saturate } from "polished";
import { useCallback, useMemo } from "react";
import { styled, useTheme } from "styled-components";

import { Chart } from "./Chart";
import { InfoBox } from "./InfoBox";
import Loader from "./Loader";
import { Bound, ChartEntry, TickDataRaw, ZOOM_LEVELS, ZoomLevels } from "./types";

const ChartWrapper = styled.div`
  position: relative;

  justify-content: center;
  align-content: center;
`;

export function LiquidityChartRangeInput({
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit = {},
  price,
  priceLower,
  priceUpper,
  onBothRangeInput = () => {
    // default
  },
  onLeftRangeInput = () => {
    // default
  },
  onRightRangeInput = () => {
    // default
  },
  interactive = true,
  isLoading,
  error,
  zoomLevel,
  formattedData,
}: {
  tickCurrent?: number;
  liquidity?: bigint;
  isLoading?: boolean;
  error?: Error;
  currencyA?: Currency | null;
  currencyB?: Currency | null;
  feeAmount?: FeeAmount;
  ticks?: TickDataRaw[];
  ticksAtLimit?: { [bound in Bound]?: boolean };
  price?: number;
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  onLeftRangeInput?: (typedValue: string) => void;
  onRightRangeInput?: (typedValue: string) => void;
  onBothRangeInput?: (leftTypedValue: string, rightTypedValue: string) => void;
  interactive?: boolean;
  zoomLevel?: ZoomLevels;
  formattedData: ChartEntry[] | undefined;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Get token color
  const tokenAColor = "#7645D9";
  const tokenBColor = "#7645D9";

  const isSorted = useMemo(
    () => currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped),
    [currencyA, currencyB]
  );

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    return leftPrice && rightPrice
      ? [parseFloat(leftPrice?.toSignificant(18)), parseFloat(rightPrice?.toSignificant(18))]
      : undefined;
  }, [isSorted, priceLower, priceUpper]);

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      const [leftPrice, rightPrice] = brushDomain || [];

      let leftRangeValue = Number(domain[0]);
      const rightRangeValue = Number(domain[1]);

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6;
      }

      const updateLeft =
        (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] || mode === "handle" || mode === "reset") &&
        leftRangeValue > 0 &&
        leftRangeValue !== leftPrice;

      const updateRight =
        (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] || mode === "reset") &&
        rightRangeValue > 0 &&
        rightRangeValue < 1e35 &&
        rightRangeValue !== rightPrice;

      if (updateLeft && updateRight) {
        const parsedLeftRangeValue = parseFloat(leftRangeValue.toFixed(18));
        const parsedRightRangeValue = parseFloat(rightRangeValue.toFixed(18));
        if (parsedLeftRangeValue > 0 && parsedRightRangeValue > 0 && parsedLeftRangeValue < parsedRightRangeValue) {
          onBothRangeInput?.(leftRangeValue.toFixed(18), rightRangeValue.toFixed(18));
        }
      } else if (updateLeft) {
        onLeftRangeInput?.(leftRangeValue.toFixed(18));
      } else if (updateRight) {
        onRightRangeInput?.(rightRangeValue.toFixed(18));
      }
    },
    [isSorted, onBothRangeInput, onLeftRangeInput, onRightRangeInput, ticksAtLimit, brushDomain]
  );

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
            key={`${feeAmount ?? FeeAmount.MEDIUM}`}
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
            zoomLevels={zoomLevel ?? ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            ticksAtLimit={ticksAtLimit}
          />
        </ChartWrapper>
      )}
    </AutoColumn>
  );
}
