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
import { json, missing } from 'itty-router-extras'
import { CORS_ALLOW, handleCors, wrapCorsHeader } from '@pancakeswap/worker-utils'
import BigNumber from 'bignumber.js'
import { gql, GraphQLClient } from 'graphql-request'
import dayjs from 'dayjs'
import { ChainId, V2_SUBGRAPHS, V3_SUBGRAPHS } from '@pancakeswap/chains'
import { createPublicClient, erc20Abi, formatEther, http, PublicClient } from 'viem'
import { bsc } from 'viem/chains'
import { getBlocksFromTimestamps } from './getBlocksFromTimestamps'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 18,
})

const router = Router()

// Values fetched from TheGraph and BitQuery jan 24, 2022
const txCount = 54780336
const addressCount = 4425459
const tvl = 6082955532.115718

const EXPLORER_API = 'https://info-gateway.pancakeswap.com'
const BIT_QUERY = 'https://graphql.bitquery.io'
const CAKE_BSC_ADDRESS = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
const VE_CAKE_BSC_ADDRESS = '0x5692DB8177a81A6c6afc8084C2976C9933EC1bAB'
const CAKE_VAULT_ADDRESS = '0x45c54210128a065de780C4B0Df3d16664f7f859e'

const bitQueryServerClient = new GraphQLClient(BIT_QUERY, {
  headers: {
    // only server, no `NEXT_PUBLIC` not going to expose in client
    // 'X-API-KEY': process.env.BIT_QUERY_HEADER || '',
    'X-API-KEY': BIT_QUERY_HEADER || '',
  },
  timeout: 5000,
  fetch,
})

const bscClient: PublicClient = createPublicClient({
  chain: bsc,
  transport: http(BSC_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

router.get('/info', async (_, event) => {
  const cache = caches.default
  const cacheResponse = await cache.match(event.request)
  let response
  if (!cacheResponse) {
    const totalTxV2Query = gql`
      query TotalTransactions($block: Block_height) {
        pancakeFactories(block: $block) {
          totalTransactions
        }
      }
    `

    const totalTxV3Query = gql`
      query TotalTransactions($block: Block_height) {
        factories(block: $block) {
          txCount
        }
      }
    `

    const days30Ago = dayjs().subtract(30, 'days')

    const results = {
      totalTx30Days: txCount,
      addressCount30Days: addressCount,
      tvl,
    }

    const v3ProdClients = Object.entries(V3_SUBGRAPHS)
      .filter(([string, clientUrl]) => {
        return Boolean(!ChainId[string as any].toLowerCase().includes('test') && clientUrl)
      })
      .map(([, clientUrl]) => {
        return new GraphQLClient(clientUrl!, {
          timeout: 5000,
          headers: {
            origin: 'https://pancakeswap.finance',
          },
          fetch,
        })
      })

    const v2ProdClients = Object.entries({
      ...V2_SUBGRAPHS,
      [ChainId.BSC]: `${EXPLORER_API}/subgraphs/v2/bsc/graphql`,
    })
      .filter(([string, clientUrl]) => {
        return Boolean(!ChainId[string as any].toLowerCase().includes('test') && clientUrl)
      })
      .map(([, clientUrl]) => {
        return new GraphQLClient(clientUrl!, {
          timeout: 5000,
          headers: {
            origin: 'https://pancakeswap.finance',
          },
          fetch,
        })
      })

    try {
      const [days30AgoBlock] = await getBlocksFromTimestamps([days30Ago.unix()])

      if (!days30AgoBlock) {
        throw new Error('No block found for 30 days ago')
      }

      const v2TotalTxResults: any[] = (
        await Promise.all(
          v2ProdClients.map(async (client) => {
            let result
            try {
              result = await client.request<any>(totalTxV2Query)
            } catch (error) {
              console.error('Error when fetching tvl stats', error)
            }
            return result
          }),
        )
      ).filter(Boolean)

      const v2TotalTx30DaysAgoResults: any[] = (
        await Promise.all(
          v2ProdClients.map(async (client) => {
            let result
            try {
              result = await client.request<any>(totalTxV2Query, {
                block: {
                  number: days30AgoBlock.number,
                },
              })
            } catch (error) {
              console.error('Error when fetching tvl stats', error)
            }
            return result
          }),
        )
      ).filter(Boolean)

      const v2TotalTx = v2TotalTxResults
        .map((factories) => {
          return factories.pancakeFactories?.[0]
        })
        .filter(Boolean)
        .map((transactions) => {
          return transactions.totalTransactions
        })
        .reduce((acc, v2Tx) => acc + parseFloat(v2Tx), 0)

      const v2Total30DaysAgoTx = v2TotalTx30DaysAgoResults
        .map((factories) => {
          return factories.pancakeFactories?.[0]
        })
        .filter(Boolean)
        .map((transactions) => {
          return transactions.totalTransactions
        })
        .reduce((acc, v2Tx30Ago) => acc + parseFloat(v2Tx30Ago), 0)

      const v3TotalTxResults: any[] = (
        await Promise.all(
          v3ProdClients.map(async (client) => {
            let result
            try {
              result = await client.request<any>(totalTxV3Query)
            } catch (error) {
              console.error('Error when fetching tvl stats', error)
            }
            return result
          }),
        )
      ).filter(Boolean)

      const v3TotalTx30DaysAgoResults: any[] = (
        await Promise.all(
          v3ProdClients.map(async (client) => {
            let result
            try {
              result = await client.request<any>(totalTxV3Query, {
                block: {
                  number: days30AgoBlock.number,
                },
              })
            } catch (error) {
              console.error('Error when fetching tvl stats', error)
            }
            return result
          }),
        )
      ).filter(Boolean)

      const v3TotalTx = v3TotalTxResults
        .map((factories) => {
          return factories.factories?.[0]
        })
        .filter(Boolean)
        .map((transactions) => {
          return transactions.txCount
        })
        .reduce((acc, v3Tx) => acc + parseFloat(v3Tx), 0)

      const v3Total30DaysAgoTx = v3TotalTx30DaysAgoResults
        .map((factories) => {
          return factories.factories?.[0]
        })
        .filter(Boolean)
        .map((transactions) => {
          return transactions.txCount
        })
        .reduce((acc, v3Tx30DaysAgo) => acc + parseFloat(v3Tx30DaysAgo), 0)

      const totalTx = parseInt(v3TotalTx + v2TotalTx)
      const totalTx30DaysAgo = parseInt(v3Total30DaysAgoTx + v2Total30DaysAgoTx)

      if (totalTx && totalTx30DaysAgo && totalTx > totalTx30DaysAgo) {
        results.totalTx30Days = totalTx - totalTx30DaysAgo
      }
    } catch (error) {
      console.error('Error when fetching total tx count', error)
    }

    const usersQuery = gql`
      query userCount($since: ISO8601DateTime, $till: ISO8601DateTime) {
        ethereum(network: bsc) {
          dexTrades(exchangeName: { in: ["Pancake", "Pancake v2"] }, date: { since: $since, till: $till }) {
            count(uniq: senders)
          }
        }
      }
    `

    if (BIT_QUERY_HEADER) {
      try {
        const result = await bitQueryServerClient.request<any>(usersQuery, {
          since: days30Ago.toISOString(),
          till: new Date().toISOString(),
        })
        if (result?.ethereum?.dexTrades?.[0]?.count) {
          results.addressCount30Days = result.ethereum.dexTrades[0].count
        }
      } catch (error) {
        console.error('Error when fetching address count', error)
      }
    }

    try {
      const v3TvlResults: any[] = (
        await Promise.all(
          v3ProdClients.map(async (client) => {
            let result
            try {
              result = await client.request<any>(gql`
                query tvl {
                  factories(first: 1) {
                    totalValueLockedUSD
                  }
                }
              `)
            } catch (error) {
              console.error('Error when fetching tvl stats', error)
            }
            return result
          }),
        )
      ).filter(Boolean)

      const v2TvlResults: any[] = (
        await Promise.all(
          v2ProdClients.map(async (client) => {
            let result
            try {
              result = await client.request<any>(gql`
                query tvl {
                  pancakeFactories(first: 1) {
                    totalLiquidityUSD
                  }
                }
              `)
            } catch (error) {
              console.error('Error when fetching tvl stats', error)
            }
            return result
          }),
        )
      ).filter(Boolean)

      const v3Tvl = v3TvlResults
        .map((factories) => {
          return factories.factories?.[0]
        })
        .filter(Boolean)
        .map((valueLocked) => {
          return valueLocked.totalValueLockedUSD
        })
        .reduce((acc, v3TvlString) => acc + parseFloat(v3TvlString), 0)

      const v2Tvl = v2TvlResults
        .map((factories) => {
          return factories.pancakeFactories?.[0]
        })
        .filter(Boolean)
        .map((valueLocked) => {
          return valueLocked.totalLiquidityUSD
        })
        .reduce((acc, v2TvlString) => acc + parseFloat(v2TvlString), 0)

      const cake = (await (await fetch('https://farms-api.pancakeswap.com/price/cake')).json()) as any

      const totalCakeInVault = await bscClient.readContract({
        abi: erc20Abi,
        address: CAKE_BSC_ADDRESS,
        functionName: 'balanceOf',
        args: [CAKE_VAULT_ADDRESS],
      })
      const totalCakeInVE = await bscClient.readContract({
        abi: erc20Abi,
        address: CAKE_BSC_ADDRESS,
        functionName: 'balanceOf',
        args: [VE_CAKE_BSC_ADDRESS],
      })

      results.tvl =
        parseFloat(formatEther(totalCakeInVault)) * cake.price +
        parseFloat(formatEther(totalCakeInVE)) * cake.price +
        v3Tvl +
        v2Tvl
    } catch (error) {
      console.error('Error when fetching tvl stats', error)
    }

    response = json(
      { ...results, updatedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      },
    )

    event.waitUntil(cache.put(event.request, response.clone()))
  } else {
    response = new Response(cacheResponse.body, cacheResponse)
  }

  return response
})

router.all('*', () => missing('Not found'))

router.options('*', handleCors(CORS_ALLOW, `GET, HEAD, OPTIONS`, `referer, origin, content-type`))

addEventListener('fetch', (event) =>
  event.respondWith(
    router
      .handle(event.request, event)
      .then((res) => wrapCorsHeader(event.request, res, { allowedOrigin: CORS_ALLOW })),
  ),
)
