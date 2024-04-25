import { dehydrate, QueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { gql, GraphQLClient } from 'graphql-request'
import { GetStaticProps } from 'next'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import { getCakeContract } from 'utils/contractHelpers'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { bitQueryServerClient } from 'utils/graphql'
import { formatEther } from 'viem'
import { V2_SUBGRAPH_URLS, V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/chains'
import addresses from 'config/constants/contracts'
import Home from '../views/Home'

const IndexPage = () => {
  return <Home />
}

// Values fetched from TheGraph and BitQuery jan 24, 2022
const txCount = 54780336
const addressCount = 4425459

const tvl = 6082955532.115718

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()

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

  const v3ProdClients = Object.entries(V3_SUBGRAPH_URLS)
    .filter(([string, clientUrl]) => {
      return Boolean(!ChainId[string].toLowerCase().includes('test') && clientUrl)
    })
    .map(([, clientUrl]) => {
      return new GraphQLClient(clientUrl!, {
        timeout: 5000,
        headers: {
          origin: 'https://pancakeswap.finance',
        },
      })
    })

  const v2ProdClients = Object.entries(V2_SUBGRAPH_URLS)
    .filter(([string, clientUrl]) => {
      return Boolean(!ChainId[string].toLowerCase().includes('test') && clientUrl)
    })
    .map(([, clientUrl]) => {
      return new GraphQLClient(clientUrl!, {
        timeout: 5000,
        headers: {
          origin: 'https://pancakeswap.finance',
        },
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
        v2ProdClients.map(async (client) => {
          let result
          try {
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

    const v3TotalTxResults: any[] = (
      await Promise.all(
        v3ProdClients.map(async (client) => {
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
        v3ProdClients.map(async (client) => {
          let result
          try {
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

    const totalTx = parseInt(v3TotalTx + v2TotalTx)
    const totalTx30DaysAgo = parseInt(v3Total30DaysAgoTx + v2Total30DaysAgoTx)

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
      ethereum(network: bsc) {
        dexTrades(exchangeName: { in: ["Pancake", "Pancake v2"] }, date: { since: $since, till: $till }) {
          count(uniq: senders)
        }
      }
    }
  `

  if (process.env.BIT_QUERY_HEADER) {
    try {
      const result = await bitQueryServerClient.request<any>(usersQuery, {
        since: days30Ago.toISOString(),
        till: new Date().toISOString(),
      })
      if (result?.ethereum?.dexTrades?.[0]?.count) {
        results.addressCount30Days = result.ethereum.dexTrades[0].count
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        console.error('Error when fetching address count', error)
      }
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
            if (process.env.NODE_ENV === 'production') {
              console.error('Error when fetching tvl stats', error)
            }
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
            if (process.env.NODE_ENV === 'production') {
              console.error('Error when fetching tvl stats', error)
            }
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

    const cake = await (await fetch('https://farms-api.pancakeswap.com/price/cake')).json()
    const cakeVaultV2 = getCakeVaultAddress()
    const cakeContract = getCakeContract()
    const totalCakeInVault = await cakeContract.read.balanceOf([cakeVaultV2])
    const totalCakeInVE = await cakeContract.read.balanceOf([addresses.veCake[ChainId.BSC]])
    results.tvl =
      parseFloat(formatEther(totalCakeInVault)) * cake.price +
      parseFloat(formatEther(totalCakeInVE)) * cake.price +
      v3Tvl +
      v2Tvl
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error when fetching tvl stats', error)
    }
  }

  queryClient.setQueryData(['totalTx30Days'], results.totalTx30Days)
  queryClient.setQueryData(['tvl'], results.tvl)
  queryClient.setQueryData(['addressCount30Days'], results.addressCount30Days)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 24 * 30, // 30 days
  }
}

IndexPage.chains = []
IndexPage.isShowV4IconButton = true

export default IndexPage
