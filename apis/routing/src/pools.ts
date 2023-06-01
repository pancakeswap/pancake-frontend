import type { Router } from 'itty-router'
import { missing } from 'itty-router-extras'

export const getPoolsObjectName = (chainId: string | number) => `v3_pools_${chainId}_latest`

export function poolsRoute(router: Router) {
  router.get('/v0/v3-pools/:chainId', async (req, event) => {
    const url = new URL(req.url)
    const cacheKey = new Request(url.toString(), req)
    const cache = caches.default
    const response = await cache.match(cacheKey)
    if (response) {
      console.log(`Cache hit for: ${req.url}.`)
      return response
    }
    console.log(`Response for request url: ${req.url} not present in cache. Fetching and caching request.`)

    const chainId = req.params?.chainId
    const objectName = chainId && getPoolsObjectName(chainId)
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

    const res = new Response(object.body, {
      headers,
    })

    event.waitUntil(cache.put(cacheKey, res.clone()))

    return res
  })
}
