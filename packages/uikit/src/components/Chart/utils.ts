export enum ChartDataTimeWindowEnum {
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export const dateFormattingByTimewindow: Record<ChartDataTimeWindowEnum, string> = {
  [ChartDataTimeWindowEnum.HOUR]: "h:mm a",
  [ChartDataTimeWindowEnum.DAY]: "h:mm a",
  [ChartDataTimeWindowEnum.WEEK]: "MMM dd",
  [ChartDataTimeWindowEnum.MONTH]: "MMM dd",
  [ChartDataTimeWindowEnum.YEAR]: "MMM dd",
};
