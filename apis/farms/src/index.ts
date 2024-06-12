/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { CORS_ALLOW, handleCors, wrapCorsHeader } from '@pancakeswap/worker-utils'
import BigNumber from 'bignumber.js'
import { Router } from 'itty-router'
import { error, json, missing } from 'itty-router-extras'
import { fetchCakePrice, saveFarms } from './handler'
import { requireChainId } from './helper'
import { FarmKV } from './kv'
import { handler as v3Handler } from './v3'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 18,
})

const router = Router()

router.get('/price/cake', async (_, event) => {
  const cache = caches.default
  const cacheResponse = await cache.match(event.request)
  let response
  if (!cacheResponse) {
    const price = await fetchCakePrice()
    response = json(
      { price, updatedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, max-age=10, s-maxage=10',
        },
      },
    )

    event.waitUntil(cache.put(event.request, response.clone()))
  } else {
    response = new Response(cacheResponse.body, cacheResponse)
  }

  return response
})

router.get('/:chainId', async ({ params }, event) => {
  const err = requireChainId(params)
  if (err) return err
  const { chainId } = params!

  const cached = KV_CACHE && (await FarmKV.getFarms(chainId))

  if (!cached || Date.now() - new Date(cached.updatedAt).getTime() > 2 * 1000 * 60) {
    if (KV_CACHE) {
      console.info('no cached found!')
    }
    try {
      const savedFarms = await saveFarms(+chainId, event)

      return json(savedFarms, {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      })
    } catch (e) {
      console.log(e)
      return error(500, 'Fetch Farms error')
    }
  }

  return json(cached, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  })
})

router.get('/v3/:chainId/liquidity/:address', v3Handler)

router.all('*', () => missing('Not found'))

router.options('*', handleCors(CORS_ALLOW, `GET, HEAD, OPTIONS`, `referer, origin, content-type`))

addEventListener('fetch', (event) =>
  event.respondWith(
    router
      .handle(event.request, event)
      .then((res) => wrapCorsHeader(event.request, res, { allowedOrigin: CORS_ALLOW })),
  ),
)
