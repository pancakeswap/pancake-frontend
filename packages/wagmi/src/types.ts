export type ExtendFunctionParams<T extends (param: any) => any, Extension> = T extends (param: infer P) => infer R
  ? (param: P & Extension) => R
  : never
