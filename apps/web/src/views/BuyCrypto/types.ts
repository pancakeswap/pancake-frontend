import { ChainId } from '@pancakeswap/chains'
import {
  type DefaultError,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { ONRAMP_PROVIDERS, OnRampChainId } from './constants'

export type Evaluate<type> = { [key in keyof type]: type[key] } & unknown

export type ExactPartial<type> = {
  [key in keyof type]?: type[key] | undefined
}

type RecursiveDeps<deps extends readonly unknown[]> = deps extends [infer dep, ...infer rest]
  ? [dep] | [dep, ...RecursiveDeps<rest>]
  : []

export function createQueryKey<key extends string, deps extends readonly unknown[]>(id: key) {
  return (deps?: RecursiveDeps<deps>) => [id, ...(deps || [])] as unknown as [key, ...deps]
}

export type UseQueryParameters<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey,
> = Evaluate<
  ExactPartial<
    Omit<
      UseQueryOptions<queryFnData, error, data, queryKey>,
      'queryFn' | 'queryHash' | 'queryKey' | 'queryKeyHashFn' | 'suspense' | 'throwOnError'
    >
  >
>
export type UseInfiniteQueryParameters<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryData = queryFnData,
  queryKey extends QueryKey = QueryKey,
  pageParam = unknown,
> = Evaluate<
  Omit<
    UseInfiniteQueryOptions<queryFnData, error, data, queryData, queryKey, pageParam>,
    | 'initialData'
    | 'queryFn'
    | 'queryHash'
    | 'queryKey'
    | 'queryKeyHashFn'
    | 'throwOnError'
    | 'defaultPageParam'
    | 'getNextPageParam'
    | 'initialPageParam'
  >
  // & {
  //   // Fix `initialData` type
  //   initialData?: UseInfiniteQueryOptions<
  //     queryFnData,
  //     error,
  //     data,
  //     queryKey
  //   >['initialData']
  // }
>

export type UseMutationParameters<data = unknown, error = Error, variables = void, context = unknown> = Evaluate<
  Omit<UseMutationOptions<data, error, Evaluate<variables>, context>, 'mutationFn' | 'mutationKey' | 'throwOnError'>
>

export type UseMutationReturnType<data = unknown, error = Error, variables = void, context = unknown> = Evaluate<
  Omit<UseMutationResult<data, error, variables, context>, 'mutate' | 'mutateAsync'>
>

export type ProviderQuote = {
  providerFee: number
  networkFee: number
  quote: number
  amount: number
  fiatCurrency: string
  cryptoCurrency: string
  provider: keyof typeof ONRAMP_PROVIDERS
  price?: number
  error?: string
}

export enum CryptoFormView {
  Input,
  Quote,
}

export type FiatCurrency = {
  symbol: string
  name: string
}

export type OnRampProviderQuote = {
  providerFee: number
  networkFee: number
  amount: number
  quote: number
  fiatCurrency: string
  cryptoCurrency: string
  provider: keyof typeof ONRAMP_PROVIDERS
  price: number
  noFee?: number
  error?: any
}

export type OnRampQuotesPayload = {
  fiatCurrency: string | undefined
  cryptoCurrency: string | undefined
  fiatAmount: string | undefined
  network: OnRampChainId | undefined
}

export type OnRampLimitsPayload = {
  fiatCurrency: string | undefined
  cryptoCurrency: string | undefined
  network: OnRampChainId | ChainId | undefined
}

export type OnRampSignaturesPayload = {
  provider: keyof typeof ONRAMP_PROVIDERS
  fiatCurrency: string | undefined
  cryptoCurrency: string | undefined
  network: string | undefined
  amount: number
  redirectUrl: string
  externalTransactionId: string | undefined
  walletAddress: string | undefined
}

export type CurrencyLimits = {
  code: string
  maxBuyAmount: number
  minBuyAmount: number
}

export interface LimitQuote {
  baseCurrency: CurrencyLimits
  quoteCurrency: CurrencyLimits
}
