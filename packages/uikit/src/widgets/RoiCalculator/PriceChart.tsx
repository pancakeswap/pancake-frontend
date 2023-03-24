import { useTranslation } from "@pancakeswap/localization";
import { useMemo } from "react";

import { Flex, ButtonMenuItem, SwapLineChart, PairDataTimeWindowEnum, Box } from "../../components";
import { PriceData } from "./types";
import { FullWidthButtonMenu } from "./FullWidthButtonMenu";

interface Props {
  span?: number;
  prices?: PriceData[];
  priceCurrent?: number | string;
  priceUpper?: number | string;
  priceLower?: number | string;
  onSpanChange?: (spanIndex: number) => void;
}

export function PriceChart({ prices, onSpanChange, span = 0, priceUpper, priceLower, priceCurrent }: Props) {
  const priceLimits = useMemo(
    () =>
      [
        priceUpper !== undefined
          ? { title: "upper", color: "green", price: parseFloat(String(priceUpper)) }
          : undefined,
        priceCurrent !== undefined
          ? { title: "current", color: "grey", price: parseFloat(String(priceCurrent)) }
          : undefined,
        priceLower !== undefined ? { title: "lower", color: "red", price: parseFloat(String(priceLower)) } : undefined,
      ].filter((limit) => !!limit) as { title: string; color: string; price: number }[],
    [priceCurrent, priceUpper, priceLower]
  );

  const chart =
    prices && prices.length ? (
      <Box mt="0.5em" width="100%">
        <SwapLineChart data={prices} isChangePositive isChartExpanded timeWindow={span} priceLineData={priceLimits} />
      </Box>
    ) : null;

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <TimeSpans spanIndex={span} onSpanChange={onSpanChange} />
      {chart}
    </Flex>
  );
}

interface TimeSpansProps {
  spanIndex: number;
  onSpanChange?: (spanIndex: number) => void;
}

function TimeSpans({
  spanIndex,
  onSpanChange = () => {
    // default
  },
}: TimeSpansProps) {
  const { t } = useTranslation();
  const SPAN = useMemo(
    () => [
      {
        key: PairDataTimeWindowEnum.DAY,
        text: t("24H"),
      },
      {
        key: PairDataTimeWindowEnum.WEEK,
        text: t("7D"),
      },
      {
        key: PairDataTimeWindowEnum.MONTH,
        text: t("30D"),
      },
      {
        key: PairDataTimeWindowEnum.YEAR,
        text: t("1Y"),
      },
    ],
    [t]
  );

  return (
    <FullWidthButtonMenu activeIndex={spanIndex} onItemClick={onSpanChange} scale="sm">
      {SPAN.map((span) => (
        <ButtonMenuItem key={span.key} variant="tertiary">
          {span.text}
        </ButtonMenuItem>
      ))}
    </FullWidthButtonMenu>
  );
}
