import type { Router, Request, RouteHandler } from 'itty-router'
import { missing } from 'itty-router-extras'
import dayjs from 'dayjs'

function formatToDate(date: Date | number) {
  return dayjs(date).format('YYYY-MM-DD')
}

export const getPoolsObjectNameByDate = (chainId: string | number, date?: Date | number) =>
  `v3_pools_${chainId}_${date ? formatToDate(date) : 'latest'}`

export const getPoolsObjectName = (chainId: string | number) => getPoolsObjectNameByDate(chainId)

export const getPoolsTvlObjectNameByDate = (chainId: string | number, date?: Date | number) =>
  `v3_pools_tvl_${chainId}_${date ? formatToDate(date) : 'latest'}`

export const getPoolsTvlObjectName = (chainId: string | number) => getPoolsTvlObjectNameByDate(chainId)

const respondWithCache = async (req: Request, event: any, handler: RouteHandler<Request>) => {
  const url = new URL(req.url)
  const cacheKey = new Request(url.toString(), req)
  const cache = caches.default
  const response = await cache.match(cacheKey)
  if (response) {
    return response
  }

  const res = await handler(req, event)
  event.waitUntil(cache.put(cacheKey, res.clone()))

  return res
}

export function poolsRoute(router: Router) {
  const createRoute = (route: string, getObjectName: (chainId: string, date?: Date | number) => string) => {
    router.get(route, async (req, event) => {
      return respondWithCache(req, event, async () => {
        const chainId = req.params?.chainId
        const date = req.query?.date ? dayjs(req.query?.date).toDate() : undefined
        const isQueryByDate = Boolean(date)
        const objectName = chainId && getObjectName(chainId, date)
        if (!objectName) {
          return missing('Not Found')
        }

        const object = await SUBGRAPH_POOLS.get(objectName)
        if (object === null) {
          return missing('Not Found')
        }

        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set('etag', object.httpEtag)

        headers.append(
          'Cache-Control',
          isQueryByDate ? 's-maxage=86400, stale-while-revalidate=3600' : 's-maxage=1800, stale-while-revalidate=900',
        )

        return new Response(object.body, {
          headers,
        })
      })
    })
  }

  createRoute('/v0/v3-pools/:chainId', getPoolsObjectNameByDate)
  createRoute('/v0/v3-pools-tvl/:chainId', getPoolsTvlObjectNameByDate)
}
