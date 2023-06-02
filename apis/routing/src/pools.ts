import type { Router, Request, RouteHandler } from 'itty-router'
import { missing } from 'itty-router-extras'

export const getPoolsObjectName = (chainId: string | number) => `v3_pools_${chainId}_latest`

export const getPoolsTvlObjectName = (chainId: string | number) => `v3_pools_tvl_${chainId}_latest`

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
  const createRoute = (route: string, getObjectName: (chainId: string) => string) => {
    router.get(route, async (req, event) => {
      return respondWithCache(req, event, async () => {
        const chainId = req.params?.chainId
        const objectName = chainId && getObjectName(chainId)
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

        headers.append('Cache-Control', 's-maxage=86400')

        return new Response(object.body, {
          headers,
        })
      })
    })
  }

  createRoute('/v0/v3-pools/:chainId', getPoolsObjectName)
  createRoute('/v0/v3-pools-tvl/:chainId', getPoolsTvlObjectName)
}
