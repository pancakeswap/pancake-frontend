import { useTranslation } from "@pancakeswap/localization";
import { useMemo, memo } from "react";
import { styled } from "styled-components";
import { SpaceProps } from "styled-system";

import {
  Flex,
  ButtonMenuItem,
  PairPriceChart,
  PairDataTimeWindowEnum,
  Box,
  Text,
  BunnyKnownPlaceholder,
} from "@pancakeswap/uikit";
import { PriceData } from "./types";
import { FullWidthButtonMenu } from "./FullWidthButtonMenu";

const PriceDisplayContainer = styled(Flex)`
  padding: 0.25em 0.5em;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.background};
`;

interface Props {
  span?: number;
  prices?: PriceData[];
  priceCurrent?: number | string;
  priceUpper?: number | string;
  priceLower?: number | string;
  maxPrice?: number;
  minPrice?: number;
  averagePrice?: number;
  onSpanChange?: (spanIndex: number) => void;
}

export const PriceChart = memo(function PriceChart({
  prices,
  onSpanChange,
  span = 1,
  priceUpper,
  priceLower,
  priceCurrent,
  maxPrice,
  minPrice,
  averagePrice,
}: Props) {
  const { t } = useTranslation();
  const priceLimits = useMemo(
    () =>
      [
        priceUpper !== undefined
          ? { title: "upper", color: "#31D0AA", price: parseFloat(String(priceUpper)) }
          : undefined,
        priceCurrent !== undefined
          ? { title: "current", color: "#BDC2C4", price: parseFloat(String(priceCurrent)) }
          : undefined,
        priceLower !== undefined
          ? { title: "lower", color: "#ED4B9E", price: parseFloat(String(priceLower)) }
          : undefined,
      ].filter((limit) => !!limit) as { title: string; color: string; price: number }[],
    [priceCurrent, priceUpper, priceLower]
  );

  const chart =
    prices && prices.length ? (
      <Box mt="0.5em" width="100%" height="200px">
        <PairPriceChart
          data={prices}
          isChangePositive
          isChartExpanded={false}
          timeWindow={span}
          priceLineData={priceLimits}
        />
      </Box>
    ) : (
      <Flex mt="0.5em" width="100%" flexDirection="column" alignItems="center" height="200px" justifyContent="center">
        <BunnyKnownPlaceholder />
        <Text mt="1em" bold>
          {t("Price will appear here")}
        </Text>
      </Flex>
    );

  const priceKeyValueDisplay =
    prices && prices.length ? (
      <>
        <Flex flexDirection="row" justifyContent="space-between" mt="0.5em" width="100%">
          <PriceDisplay title={t("Min")} value={minPrice?.toPrecision(6)} />
          <PriceDisplay title={t("Max")} value={maxPrice?.toPrecision(6)} ml="0.5em" />
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" mt="0.5em" width="100%">
          <PriceDisplay title={t("Avg")} value={averagePrice?.toPrecision(6)} />
          <PriceDisplay title={t("Current")} value={priceCurrent} ml="0.5em" />
        </Flex>
      </>
    ) : null;

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <TimeSpans spanIndex={span} onSpanChange={onSpanChange} />
      {chart}
      {priceKeyValueDisplay}
    </Flex>
  );
});

function PriceDisplay({ title, value, ...rest }: { title?: string; value?: string | number } & SpaceProps) {
  return (
    <PriceDisplayContainer flexDirection="row" justifyContent="space-between" flex="1" {...rest}>
      <Text color="secondary" textTransform="uppercase" small>
        {title}
      </Text>
      <Text small>{value}</Text>
    </PriceDisplayContainer>
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
        key: PairDataTimeWindowEnum.HOUR,
        text: t("1H"),
      },
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
