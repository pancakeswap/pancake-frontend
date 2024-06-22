import { gql } from 'graphql-request'
import { ChainId, testnetChainIds } from '@pancakeswap/chains'
import dayjs from 'dayjs'
import { getCakeContract } from 'utils/contractHelpers'
import { formatEther } from 'viem'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import addresses from 'config/constants/contracts'
import { bitQueryServerClient } from 'utils/graphql'
import { CHAIN_IDS } from 'utils/wagmi'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'

// Values fetched from TheGraph and BitQuery jan 24, 2022
const txCount = 54780336
const addressCount = 4425459
const tvl = 6082955532.115718

const mainnetChainIds = CHAIN_IDS.filter((chainId) => {
  const isTestnet = testnetChainIds.some((testChainId) => {
    return testChainId.valueOf() === chainId
  })
  return Boolean(chainId && !isTestnet)
})

export const getTotalTvl = async () => {
  const results = {
    totalTx30Days: txCount,
    addressCount30Days: addressCount,
    tvl,
  }
  try {
    const days30Ago = dayjs().subtract(30, 'days')

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

    const { totalTvl: v2TotalTvl, txCount30d: v2TxCount30d } = await getStats('v2', mainnetChainIds)
    const { totalTvl: v3TotalTvl, txCount30d: v3TxCount30d } = await getStats('v3', mainnetChainIds)
    const { totalTvl: stableTotalTvl, txCount30d: stableTxCount30d } = await getStats('stable', [
      ChainId.ARBITRUM_ONE,
      ChainId.BSC,
    ])

    const cake = await (await fetch('https://farms-api.pancakeswap.com/price/cake')).json()
    const cakeVaultV2 = getCakeVaultAddress()
    const cakeContract = getCakeContract()
    const totalCakeInVault = await cakeContract.read.balanceOf([cakeVaultV2])
    const totalCakeInVE = await cakeContract.read.balanceOf([addresses.veCake[ChainId.BSC]])
    results.tvl =
      parseFloat(formatEther(totalCakeInVault)) * cake.price +
      parseFloat(formatEther(totalCakeInVE)) * cake.price +
      v2TotalTvl +
      v3TotalTvl +
      stableTotalTvl

    results.totalTx30Days = v2TxCount30d + v3TxCount30d + stableTxCount30d
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error when fetching tvl stats', error)
    }
  }
  return results
}

type StatsRes = {
  tvlUSD: string
  txCount30d: number
}

const getStats = async (type: 'v2' | 'v3' | 'stable', chainIds: number[]) => {
  const abortController = new AbortController()
  setTimeout(() => {
    abortController.abort()
  }, 10 * 1000)

  const rawResults = (
    await Promise.all(
      chainIds.map(async (chainId) => {
        let result: { data?: StatsRes } | undefined
        try {
          result = await explorerApiClient.GET('/cached/protocol/{protocol}/{chainName}/stats', {
            signal: abortController.signal,
            params: {
              path: {
                protocol: type,
                chainName: chainIdToExplorerInfoChainName[chainId],
              },
            },
          })
        } catch (error) {
          console.error(error)
          if (process.env.NODE_ENV === 'production') {
            console.error('Error when fetching tvl stats', error)
          }
        }
        return result
      }),
    )
  ).filter(Boolean)

  return {
    totalTvl: rawResults.reduce((acc, tvlString) => acc + parseFloat(tvlString?.data?.tvlUSD || '0'), 0),
    txCount30d: rawResults.reduce((acc, tvlString) => acc + (tvlString?.data?.txCount30d ?? 0), 0),
  }
}
