import { SmartRouter } from '@pancakeswap/smart-router/evm'

import { v3SubgraphProvider } from './provider'
import { SUPPORTED_CHAINS } from './constants'
import { getPoolsObjectName } from './pools'

// eslint-disable-next-line consistent-return
async function handleScheduled(event: ScheduledEvent) {
  switch (event.cron) {
    case '0 0 * * *': {
      for (const chainId of SUPPORTED_CHAINS) {
        try {
          const objectName = getPoolsObjectName(chainId)
          // eslint-disable-next-line no-await-in-loop
          const pools = await SmartRouter.getAllV3PoolsFromSubgraph({ chainId, provider: v3SubgraphProvider })
          const serializedPools = pools.map((p) => ({
            ...SmartRouter.Transformer.serializePool(p),
            tvlUSD: p.tvlUSD.toString(),
          }))
          // eslint-disable-next-line no-await-in-loop
          await SUBGRAPH_POOLS.put(objectName, JSON.stringify(serializedPools), {
            httpMetadata: {
              contentType: 'application/json',
            },
          })
        } catch (e) {
          console.error(e)
        }
      }
      break
    }
    default:
      break
  }
}

export function setupPoolBackupCrontab() {
  addEventListener('scheduled', (event) => {
    event.waitUntil(handleScheduled(event))
  })
}
