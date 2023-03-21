export interface ChartDayData {
  date: number
  volumeUSD: number
  tvlUSD: number
}

export enum VolumeWindow {
  daily,
  weekly,
  monthly,
}
