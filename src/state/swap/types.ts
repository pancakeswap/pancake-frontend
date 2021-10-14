export type PairPricesNormalized = {
  time: Date
  value: number
}[]

export enum PairDataTimeWindowEnum {
  DAY,
  WEEK,
  MONTH,
  YEAR,
  ALL_TIME,
}
