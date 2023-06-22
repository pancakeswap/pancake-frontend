import { useTranslation } from "@pancakeswap/localization";
import { format } from "date-fns";
import { createChart, IChartApi, LineStyle, UTCTimestamp } from "lightweight-charts";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "styled-components";
import LineChartLoader from "./LineChartLoaderSVG";

export enum PairDataTimeWindowEnum {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export type SwapLineChartNewProps = {
  data?: any[] | { time: Date; value: number }[];
  setHoverValue?: Dispatch<SetStateAction<number | undefined>>; // used for value on hover
  setHoverDate?: Dispatch<SetStateAction<string | undefined>>; // used for value label on hover
  isChangePositive: boolean;
  isChartExpanded: boolean;
  timeWindow: PairDataTimeWindowEnum;
  priceLineData?: { title: string; color: string; price: number }[];
} & React.HTMLAttributes<HTMLDivElement>;

const getChartColors = ({ isChangePositive }: { isChangePositive: boolean }) => {
  return isChangePositive
    ? { gradient1: "#00E7B0", gradient2: "#0C8B6C", stroke: "#31D0AA" }
    : { gradient1: "#ED4B9E", gradient2: "#ED4B9E", stroke: "#ED4B9E " };
};

const dateFormattingByTimewindow: Record<PairDataTimeWindowEnum, string> = {
  [PairDataTimeWindowEnum.DAY]: "h:mm a",
  [PairDataTimeWindowEnum.WEEK]: "MMM dd",
  [PairDataTimeWindowEnum.MONTH]: "MMM dd",
  [PairDataTimeWindowEnum.YEAR]: "MMM dd",
};

export const SwapLineChart: React.FC<SwapLineChartNewProps> = ({
  data,
  setHoverValue,
  setHoverDate,
  isChangePositive,
  isChartExpanded,
  timeWindow,
  priceLineData,
  ...rest
}) => {
  const { isDark } = useTheme();
  const transformedData = useMemo(() => {
    return (
      data?.map(({ time, value }) => {
        return { time: Math.floor(time.getTime() / 1000) as UTCTimestamp, value };
      }) || []
    );
  }, [data]);
  const {
    currentLanguage: { locale },
  } = useTranslation();
  const chartRef = useRef<HTMLDivElement>(null);
  const colors = useMemo(() => {
    return getChartColors({ isChangePositive });
  }, [isChangePositive]);
  const [chartCreated, setChart] = useState<IChartApi | undefined>();

  useEffect(() => {
    if (!chartRef?.current) return;

    const chart = createChart(chartRef?.current, {
      layout: {
        background: { color: "transparent" },
        textColor: isDark ? "#F4EEFF" : "#280D5F",
      },
      autoSize: true,
      handleScale: false,
      handleScroll: false,
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.1,
        },
        borderVisible: false,
      },
      timeScale: {
        visible: true,
        borderVisible: false,
        secondsVisible: false,
        tickMarkFormatter: (unixTime: number) => {
          return format(unixTime * 1000, dateFormattingByTimewindow[timeWindow]);
        },
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      crosshair: {
        horzLine: {
          visible: true,
          labelVisible: true,
        },
        mode: 1,
        vertLine: {
          visible: true,
          labelVisible: false,
          style: 3,
          width: 1,
          color: isDark ? "#B8ADD2" : "#7A6EAA",
        },
      },
    });

    const precision =
      priceLineData
        ?.find((x) => x.title === "current")
        ?.price?.toString()
        ?.split(".")?.[1]?.length ?? 2;

    const newSeries = chart.addAreaSeries({
      lineWidth: 2,
      lineColor: colors.gradient1,
      topColor: colors.gradient1,
      bottomColor: isDark ? "#3c3742" : "white",
      priceFormat: { type: "price", precision, minMove: 1 / 10 ** precision },
    });
    newSeries.applyOptions({
      priceFormat: {
        type: "price",
        precision: 4,
        minMove: 0.0001,
      },
    });
    setChart(chart);
    newSeries.setData(transformedData);
    if (priceLineData && priceLineData.length > 0)
      priceLineData?.forEach((d) => {
        newSeries.createPriceLine({
          price: d.price,
          color: d.color,
          lineWidth: 2,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: d.title,
        });
      });

    chart.timeScale().fitContent();

    chart.subscribeCrosshairMove((param) => {
      if (newSeries && param) {
        const timestamp = param.time as number;
        if (!timestamp) return;
        const now = new Date(timestamp * 1000);
        const time = `${now.toLocaleString(locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZone: "UTC",
        })} (UTC)`;
        // @ts-ignore
        const parsed = (param.seriesData.get(newSeries)?.value ?? 0) as number | undefined;
        if (setHoverValue) setHoverValue(parsed);
        if (setHoverDate) setHoverDate(time);
      } else {
        if (setHoverValue) setHoverValue(undefined);
        if (setHoverDate) setHoverDate(undefined);
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      chart.remove();
    };
  }, [
    transformedData,
    isDark,
    colors,
    isChartExpanded,
    locale,
    timeWindow,
    setHoverDate,
    setHoverValue,
    priceLineData,
  ]);

  const handleMouseLeave = useCallback(() => {
    if (setHoverValue) setHoverValue(undefined);
    if (setHoverDate) setHoverDate(undefined);
  }, [setHoverValue, setHoverDate]);

  return (
    <>
      {!chartCreated && <LineChartLoader />}
      <div style={{ display: "flex", flex: 1, height: "100%" }} onMouseLeave={handleMouseLeave}>
        <div style={{ flex: 1, maxWidth: "100%" }} ref={chartRef} id="swap-line-chart" {...rest} />
      </div>
    </>
  );
};

export default SwapLineChart;
