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

import { Router } from 'itty-router'
import { error, json, missing } from 'itty-router-extras'
import { saveFarms, saveLPsAPR } from './handler'
import { farmFetcher, handleCors, requireChainId, wrapCorsHeader } from './helper'
import { FarmKV } from './kv'

const router = Router()

const allowedOrigin = /[^\w](?:pancake\.run|localhost:3000|pancakeswap\.finance|pancakeswap\.com)$/

router.get('/apr', async ({ query }) => {
  if (typeof query?.key === 'string' && query.key === FORCE_UPDATE_KEY) {
    try {
      const result = await Promise.allSettled(farmFetcher.supportedChainId.map((id) => saveLPsAPR(id)))
      return json(result.map((r) => r))
    } catch (err) {
      error(500, { err })
    }
  }
  return error(400, 'no key provided')
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

      return json(savedFarms)
    } catch (e) {
      console.log(e)
      return error(500, 'Fetch Farms error')
    }
  }

  return json(cached)
})

router.all('*', () => missing('Not found'))

router.options('*', handleCors(allowedOrigin))

addEventListener('fetch', (event) =>
  event.respondWith(
    router.handle(event.request, event).then((res) => wrapCorsHeader(event.request, res, { allowedOrigin })),
  ),
)

addEventListener('scheduled', (event) => {
  event.waitUntil(handleScheduled(event))
})

// eslint-disable-next-line consistent-return
async function handleScheduled(event: ScheduledEvent) {
  switch (event.cron) {
    case '*/1 * * * *':
    case '*/2 * * * *': {
      const result = await Promise.allSettled(farmFetcher.supportedChainId.map((id) => saveFarms(id, event)))
      console.log(result.map((r) => r))
      return result
    }
    case '0 0 * * *': {
      const result = await Promise.allSettled(farmFetcher.supportedChainId.map((id) => saveLPsAPR(id)))
      console.log(result.map((r) => r))
      return result
    }
    default:
      break
  }
}
