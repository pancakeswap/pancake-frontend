/* eslint-disable no-param-reassign */
import { FetchStatus } from 'config/constants/types'
import { useEffect, useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { FormatTypes } from '@ethersproject/abi'
import useSWR, {
  Middleware,
  SWRConfiguration,
  KeyedMutator,
  // eslint-disable-next-line camelcase
  unstable_serialize,
} from 'swr'
import { multicallv2, MulticallOptions, Call } from 'utils/multicall'
import { MaybeContract, ContractMethodName, ContractMethodParams } from 'utils/types'

declare module 'swr' {
  interface SWRResponse<Data = any, Error = any> {
    data: Data | undefined
    error: Error | undefined
    mutate: KeyedMutator<Data>
    isValidating: boolean
    isLoading: boolean
    // Add global fetchStatus to SWRResponse
    status: FetchStatus
  }
}

export const fetchStatusMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config)
    return Object.defineProperty(swr, 'status', {
      get() {
        let status = FetchStatus.Idle

        if (!swr.isValidating && !swr.error && !swr.data) {
          status = FetchStatus.Idle
        } else if (swr.isValidating && !swr.error && !swr.data) {
          status = FetchStatus.Fetching
        } else if (swr.data) {
          status = FetchStatus.Fetched
        } else if (swr.error && !swr.data) {
          status = FetchStatus.Failed
        }
        return status
      },
    })
  }
}

type UseSWRContractArrayKey<C extends Contract = Contract, N extends ContractMethodName<C> = any> =
  | [MaybeContract<C>, N, ContractMethodParams<C, N>]
  | [MaybeContract<C>, N]

export type UseSWRContractObjectKey<
  C extends Contract = Contract,
  N extends ContractMethodName<C> = ContractMethodName<C>,
> = {
  contract: MaybeContract<C>
  methodName: N
  params?: ContractMethodParams<C, N>
}

type UseSWRContractSerializeKeys = {
  address: string
  interfaceFormat: string[]
  methodName: string
  callData: string
}

const getContractKey = <T extends Contract = Contract, N extends ContractMethodName<T> = any>(
  key?: UseSWRContractKey<T, N> | null,
) => {
  if (Array.isArray(key)) {
    const [contract, methodName, params] = key || []
    return {
      contract,
      methodName,
      params,
    }
  }
  return key
}

const serializesContractKey = <T extends Contract = Contract>(
  key?: UseSWRContractKey<T> | null,
): UseSWRContractSerializeKeys | null => {
  const { contract, methodName, params } = getContractKey(key) || {}
  const serializedKeys =
    key && contract && methodName
      ? {
          address: contract.address,
          interfaceFormat: contract.interface.format(FormatTypes.full) as string[],
          methodName,
          callData: contract.interface.encodeFunctionData(methodName, params),
        }
      : null
  return serializedKeys
}

export type UseSWRContractKey<T extends Contract = Contract, N extends ContractMethodName<T> = any> =
  | UseSWRContractArrayKey<T, N>
  | UseSWRContractObjectKey<T, N>

/**
 * @example
 * const key = [contract, 'methodName', [params]]
 * const key = { contract, methodName, params }
 * const { data, error, mutate } = useSWRContract(key)
 */
export function useSWRContract<
  Error = any,
  T extends Contract = Contract,
  N extends ContractMethodName<T> = ContractMethodName<T>,
  Data = Awaited<ReturnType<T['callStatic'][N]>>,
>(key?: UseSWRContractKey<T, N> | null, config: SWRConfiguration<Data, Error> = {}) {
  const { contract, methodName, params } = getContractKey(key) || {}
  const serializedKeys = useMemo(() => serializesContractKey(key), [key])

  return useSWR<Data, Error>(
    serializedKeys,
    async () => {
      if (!contract || !methodName) return null
      if (!params) return contract[methodName]()
      return contract[methodName](...params)
    },
    config,
  )
}

export const immutableMiddleware: Middleware = (useSWRNext) => (key, fetcher, config) => {
  config.revalidateOnFocus = false
  config.revalidateIfStale = false
  config.revalidateOnReconnect = false
  return useSWRNext(key, fetcher, config)
}

export function useSWRMulticall<Data>(abi: any[], calls: Call[], options?: MulticallOptions & SWRConfiguration) {
  const { requireSuccess = true, ...config } = options || {}
  return useSWR<Data>(calls, () => multicallv2({ abi, calls, options: { requireSuccess } }), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    ...config,
  })
}

export const localStorageMiddleware: Middleware = (useSWRNext) => (key, fetcher, config) => {
  const swr = useSWRNext(key, fetcher, config)
  const { data } = swr
  const serializedKey = useMemo(() => unstable_serialize(key), [key])

  useEffect(() => {
    if (data) {
      try {
        const stringify = JSON.stringify(data)
        localStorage?.setItem(serializedKey, stringify)
      } catch (error) {
        //
      }
    }
  }, [data, serializedKey])

  let localStorageDataParsed

  if (!data && typeof window !== 'undefined') {
    const localStorageData = localStorage?.getItem(serializedKey)

    if (localStorageData) {
      try {
        localStorageDataParsed = JSON.parse(localStorageData)
      } catch (error) {
        localStorage?.removeItem(serializedKey)
      }
    }
  }

  return Object.defineProperty(swr, 'data', {
    value: data || localStorageDataParsed,
  })
}

// dev only
export const loggerMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    // Add logger to the original fetcher.
    const extendedFetcher = fetcher
      ? (...args: unknown[]) => {
          console.debug('SWR Request:', key)
          return fetcher(...args)
        }
      : null

    // Execute the hook with the new fetcher.
    return useSWRNext(key, extendedFetcher, config)
  }
}
