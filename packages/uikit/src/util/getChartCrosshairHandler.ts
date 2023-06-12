import { ISeriesApi, MouseEventParams } from "lightweight-charts";

export const getChartCrosshairHandler = (
  newSeries: ISeriesApi<any>,
  locale: string,
  setHoverDate: ((date: string | undefined) => void) | undefined,
  setHoverValue: ((value: number | undefined) => void) | undefined
) => {
  return (param: MouseEventParams) => {
    if (newSeries && param) {
      const timestamp = param.time as number;
      if (!timestamp) return;
      const now = new Date(timestamp);
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
  };
};
