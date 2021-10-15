export type PairDataNormalized = {
  time: Date
  token0Id: string
  token1Id: string
  token0Price: number
  token1Price: number
}[]

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
