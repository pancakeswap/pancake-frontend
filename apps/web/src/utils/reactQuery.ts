import type { DefaultError, QueryKey, UseInfiniteQueryOptions, UseQueryOptions } from '@tanstack/react-query'

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
