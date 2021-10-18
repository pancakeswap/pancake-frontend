export type PairDataNormalized = {
  time: number
  token0Id: string
  token1Id: string
  reserve0: number
  reserve1: number
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
