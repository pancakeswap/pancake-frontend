export type ExtendFunctionParams<T extends (param: any) => any, Extension> = T extends (param: infer P) => infer R
  ? (param: P & Extension) => R
  : never

export type Evaluate<type> = { [key in keyof type]: type[key] } & unknown

export type GetBalanceReturnType = {
  decimals: number
  /** @deprecated */
  formatted: string
  symbol: string
  value: bigint
}

export type GetBalanceQueryFnData = Evaluate<GetBalanceReturnType>

export type GetBalanceData = GetBalanceQueryFnData
