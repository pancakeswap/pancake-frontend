import { gql, GraphQLClient } from 'graphql-request'
import { STABLESWAP_SUBGRAPHS_URLS, V2_SUBGRAPH_URLS, V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/chains'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import dayjs, { Dayjs } from 'dayjs'
import { getCakeContract } from 'utils/contractHelpers'
import { formatEther } from 'viem'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import addresses from 'config/constants/contracts'
import { bitQueryServerClient } from 'utils/graphql'
import { multiChainName } from 'state/info/constant'

// Values fetched from TheGraph and BitQuery jan 24, 2022
const txCount = 54780336
const addressCount = 4425459
const tvl = 6082955532.115718

export const getTotalTvl = async () => {
  const results = {
    totalTx30Days: txCount,
    addressCount30Days: addressCount,
    tvl,
  }
  try {
    const days30Ago = dayjs().subtract(30, 'days')

    const stableProdClients = getProdClients(STABLESWAP_SUBGRAPHS_URLS)
    const v3ProdClients = getProdClients(V3_SUBGRAPH_URLS)
    const v2ProdClients = getProdClients(V2_SUBGRAPH_URLS)

    try {
      const { v2TotalTx, v2Total30DaysAgoTx } = await getV2TotalTx(v2ProdClients, days30Ago)
      const { stableTotalTx, stableTotal30DaysAgoTx } = await getStableTotalTx(stableProdClients, days30Ago)
      const { v3TotalTx, v3Total30DaysAgoTx } = await getV3TotalTx(v3ProdClients, days30Ago)

      const totalTx = parseInt(v3TotalTx + v2TotalTx + stableTotalTx)
      const totalTx30DaysAgo = parseInt(v3Total30DaysAgoTx + v2Total30DaysAgoTx + stableTotal30DaysAgoTx)

      if (totalTx && totalTx30DaysAgo && totalTx > totalTx30DaysAgo) {
        results.totalTx30Days = totalTx - totalTx30DaysAgo
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        console.error('Error when fetching total tx count', error)
      }
    }

    const usersQuery = gql`
      query userCount($since: ISO8601DateTime, $till: ISO8601DateTime) {
        ethereum: ethereum(network: ethereum) {
          dexTrades(
            exchangeName: { in: ["Pancake", "Pancake v2", "PancakeSwap"] }
            date: { since: $since, till: $till }
          ) {
            count(uniq: senders)
          }
        }
        bsc: ethereum(network: bsc) {
          dexTrades(
            exchangeName: { in: ["Pancake", "Pancake v2", "PancakeSwap"] }
            date: { since: $since, till: $till }
          ) {
            count(uniq: senders)
          }
        }
      }
    `

    if (process.env.BIT_QUERY_HEADER) {
      try {
        let querySuccess = false
        const queryResult = await bitQueryServerClient.request<any>(usersQuery, {
          since: days30Ago.toISOString(),
          till: new Date().toISOString(),
        })
        Object.keys(queryResult).forEach((key) => {
          if (!querySuccess) {
            results.addressCount30Days = queryResult[key].dexTrades[0].count
          } else {
            results.addressCount30Days += queryResult[key].dexTrades[0].count
          }
          querySuccess = true
        })
      } catch (error) {
        if (process.env.NODE_ENV === 'production') {
          console.error('Error when fetching address count', error)
        }
      }
    }

    const v3Tvl = await getV3Tvl(v3ProdClients.map(({ client }) => client))
    const stableTvl = await getStableTvl(stableProdClients.map(({ client }) => client))
    const v2Tvl = await getV2Tvl(v2ProdClients.map(({ client }) => client))

    const cake = await (await fetch('https://farms-api.pancakeswap.com/price/cake')).json()
    const cakeVaultV2 = getCakeVaultAddress()
    const cakeContract = getCakeContract()
    const totalCakeInVault = await cakeContract.read.balanceOf([cakeVaultV2])
    const totalCakeInVE = await cakeContract.read.balanceOf([addresses.veCake[ChainId.BSC]])
    results.tvl =
      parseFloat(formatEther(totalCakeInVault)) * cake.price +
      parseFloat(formatEther(totalCakeInVE)) * cake.price +
      v3Tvl +
      stableTvl +
      v2Tvl
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error when fetching tvl stats', error)
    }
  }
  return results
}

const getV3TotalTx = async (v3ProdClients: { chainId: string; client: GraphQLClient }[], days30Ago: Dayjs) => {
  const totalTxV3Query = gql`
    query TotalTransactions($block: Block_height) {
      factories(block: $block) {
        txCount
      }
    }
  `

  const v3TotalTxResults: any[] = (
    await Promise.all(
      v3ProdClients.map(async ({ client }) => {
        let result
        try {
          result = await client.request<any>(totalTxV3Query)
        } catch (error) {
          if (process.env.NODE_ENV === 'production') {
            console.error('Error when fetching tvl stats', error)
          }
        }
        return result
      }),
    )
  ).filter(Boolean)

  const v3TotalTx30DaysAgoResults: any[] = (
    await Promise.all(
      v3ProdClients.map(async ({ chainId, client }) => {
        let result
        try {
          const [days30AgoBlock] = await getBlocksFromTimestamps(
            [days30Ago.unix()],
            undefined,
            undefined,
            multiChainName[chainId],
          )
          if (!days30AgoBlock) {
            throw new Error('No block found for 30 days ago')
          }
          result = await client.request<any>(totalTxV3Query, {
            block: {
              number: days30AgoBlock.number,
            },
          })
        } catch (error) {
          if (process.env.NODE_ENV === 'production') {
            console.error('Error when fetching tvl stats', error)
          }
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
  return { v3TotalTx, v3Total30DaysAgoTx }
}

const getV2TotalTx = async (v2ProdClients: { chainId: string; client: GraphQLClient }[], days30Ago: Dayjs) => {
  const totalTxV2Query = gql`
    query TotalTransactions($block: Block_height) {
      pancakeFactories(block: $block) {
        totalTransactions
      }
    }
  `

  const v2TotalTxResults: any[] = (
    await Promise.all(
      v2ProdClients.map(async ({ client }) => {
        let result
        try {
          result = await client.request<any>(totalTxV2Query)
        } catch (error) {
          if (process.env.NODE_ENV === 'production') {
            console.error('Error when fetching tvl stats', error)
          }
        }
        return result
      }),
    )
  ).filter(Boolean)

  const v2TotalTx30DaysAgoResults: any[] = (
    await Promise.all(
      v2ProdClients.map(async ({ chainId, client }) => {
        let result
        try {
          const [days30AgoBlock] = await getBlocksFromTimestamps(
            [days30Ago.unix()],
            undefined,
            undefined,
            multiChainName[chainId],
          )
          if (!days30AgoBlock) {
            throw new Error('No block found for 30 days ago')
          }
          result = await client.request<any>(totalTxV2Query, {
            block: {
              number: days30AgoBlock.number,
            },
          })
        } catch (error) {
          if (process.env.NODE_ENV === 'production') {
            console.error('Error when fetching tvl stats', error)
          }
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
  return { v2TotalTx, v2Total30DaysAgoTx }
}

const getStableTotalTx = async (stableProdClients: { chainId: string; client: GraphQLClient }[], days30Ago: Dayjs) => {
  const totalTxStableQuery = gql`
    query TotalTransactions($block: Block_height) {
      factories(block: $block) {
        totalTransactions
      }
    }
  `

  const stableTotalTxResults: any[] = (
    await Promise.all(
      stableProdClients.map(async ({ client }) => {
        let result
        try {
          result = await client.request<any>(totalTxStableQuery)
        } catch (error) {
          if (process.env.NODE_ENV === 'production') {
            console.error('Error when fetching tvl stats', error)
          }
        }
        return result
      }),
    )
  ).filter(Boolean)

  const stableTotalTx30DaysAgoResults: any[] = (
    await Promise.all(
      stableProdClients.map(async ({ chainId, client }) => {
        let result
        try {
          const [days30AgoBlock] = await getBlocksFromTimestamps(
            [days30Ago.unix()],
            undefined,
            undefined,
            multiChainName[chainId],
          )
          if (!days30AgoBlock) {
            throw new Error('No block found for 30 days ago')
          }
          result = await client.request<any>(totalTxStableQuery, {
            block: {
              number: days30AgoBlock.number,
            },
          })
        } catch (error) {
          if (process.env.NODE_ENV === 'production') {
            console.error('Error when fetching tvl stats', error)
          }
        }
        return result
      }),
    )
  ).filter(Boolean)

  const stableTotalTx = stableTotalTxResults
    .map((factories) => {
      return factories.factories?.[0]
    })
    .filter(Boolean)
    .map((transactions) => {
      return transactions.totalTransactions
    })
    .reduce((acc, stableTx) => acc + parseFloat(stableTx), 0)

  const stableTotal30DaysAgoTx = stableTotalTx30DaysAgoResults
    .map((factories) => {
      return factories.factories?.[0]
    })
    .filter(Boolean)
    .map((transactions) => {
      return transactions.totalTransactions
    })
    .reduce((acc, stableTx30DaysAgo) => acc + parseFloat(stableTx30DaysAgo), 0)
  return { stableTotalTx, stableTotal30DaysAgoTx }
}

const getV3Tvl = async (v3ProdClients: GraphQLClient[]) => {
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
          if (process.env.NODE_ENV === 'production') {
            console.error('Error when fetching tvl stats', error)
          }
        }
        return result
      }),
    )
  ).filter(Boolean)

  return v3TvlResults
    .map((factories) => {
      return factories.factories?.[0]
    })
    .filter(Boolean)
    .map((valueLocked) => {
      return valueLocked.totalValueLockedUSD
    })
    .reduce((acc, v3TvlString) => acc + parseFloat(v3TvlString), 0)
}

const getV2Tvl = async (v2ProdClients: GraphQLClient[]) => {
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
          if (process.env.NODE_ENV === 'production') {
            console.error('Error when fetching tvl stats', error)
          }
        }
        return result
      }),
    )
  ).filter(Boolean)

  return v2TvlResults
    .map((factories) => {
      return factories.pancakeFactories?.[0]
    })
    .filter(Boolean)
    .map((valueLocked) => {
      return valueLocked.totalLiquidityUSD
    })
    .reduce((acc, v2TvlString) => acc + parseFloat(v2TvlString), 0)
}

const getStableTvl = async (stableProdClients: GraphQLClient[]) => {
  const stableTvlResults: any[] = (
    await Promise.all(
      stableProdClients.map(async (client) => {
        let result
        try {
          result = await client.request<any>(gql`
            query tvl {
              factories(first: 1) {
                totalLiquidityUSD
              }
            }
          `)
        } catch (error) {
          if (process.env.NODE_ENV === 'production') {
            console.error('Error when fetching tvl stats', error)
          }
        }
        return result
      }),
    )
  ).filter(Boolean)

  return stableTvlResults
    .map((factories) => {
      return factories.factories?.[0]
    })
    .filter(Boolean)
    .map((valueLocked) => {
      return valueLocked.totalLiquidityUSD
    })
    .reduce((acc, v2TvlString) => acc + parseFloat(v2TvlString), 0)
}

const getProdClients = (urls: Partial<{ [key in ChainId]: string | null }>) => {
  return Object.entries(urls)
    .filter(([string, clientUrl]) => {
      return Boolean(!ChainId[string].toLowerCase().includes('test') && clientUrl)
    })
    .map(([string, clientUrl]) => {
      return {
        chainId: string,
        client: new GraphQLClient(clientUrl!, {
          timeout: 5000,
          headers: {
            origin: 'https://pancakeswap.finance',
          },
        }),
      }
    })
}
