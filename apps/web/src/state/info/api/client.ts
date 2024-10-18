import { ChainId } from '@pancakeswap/chains'
import { queryOptions, type QueryFunction } from '@tanstack/react-query'
import createClient, { type MaybeOptionalInit, type Middleware } from 'openapi-fetch'
import type { HasRequiredKeys, PathsWithMethod } from 'openapi-typescript-helpers'
import { createQueryKey } from 'utils/reactQuery'
import type { paths } from './schema.d'

const endpoints = process.env.NEXT_PUBLIC_EXPLORE_API_ENDPOINT || 'http://localhost:4123'

const throwOnError: Middleware = {
  async onResponse(res) {
    if (res.status >= 400) {
      const body = res.headers.get('content-type')?.includes('json')
        ? await res.clone().json()
        : await res.clone().text()
      throw new Error(body)
    }
    return undefined
  },
}

export const explorerApiClient = createClient<paths>({
  baseUrl: endpoints,
})
explorerApiClient.use(throwOnError)

export function createExplorerQuery<
  P extends PathsWithMethod<paths, 'get'>,
  I extends MaybeOptionalInit<paths[P], 'get'>,
>(url: P, ...init: HasRequiredKeys<I> extends never ? [(I & { [key: string]: unknown })?] : [I]) {
  const options = init[0]
  const body = options?.body
  const params = options?.params
  const getQueryKey = createQueryKey<
    P,
    [
      {
        body: typeof body
        params: typeof params
      },
    ]
  >(url)

  const queryKey = getQueryKey([
    {
      body,
      params,
    },
  ])

  const get = ({
    signal,
  }: {
    signal?: AbortSignal
  } = {}) =>
    // @ts-expect-error expected
    explorerApiClient.GET(url, {
      signal,
      ...init[0],
    })

  const queryFn: QueryFunction<Awaited<ReturnType<typeof get>>['data'], ReturnType<typeof getQueryKey>> = async ({
    signal,
    // queryKey: queryKey_,
  }) => {
    // const [url, { body, params }] = queryKey_
    const data = await get({ signal })

    if (data.data) return data.data
    if (data.error) throw new Error(data.error as any)
    throw new Error('Unknown error')
  }

  return {
    url,
    params,
    body,
    query: queryOptions({
      queryKey,
      queryFn,
    }),
    get,
  }
}

export const chartPeriodRange = ['1H', '1D', '1W', '1M', '1Y'] as const

export type ChartPeriod = (typeof chartPeriodRange)[number]

export const chainIdToExplorerInfoChainName = {
  [ChainId.BSC]: 'bsc',
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.POLYGON_ZKEVM]: 'polygon-zkevm',
  [ChainId.ZKSYNC]: 'zksync',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.LINEA]: 'linea',
  [ChainId.BASE]: 'base',
  [ChainId.OPBNB]: 'opbnb',
} as const
