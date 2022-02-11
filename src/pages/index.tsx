import { FACTORY_ADDRESS } from '@pancakeswap/sdk'
import { getUnixTime, sub } from 'date-fns'
import { gql } from 'graphql-request'
import { GetStaticProps } from 'next'
import { SWRConfig } from 'swr'
import { DeBankTvlResponse } from 'hooks/api'
import { bitQueryServerClient, infoServerClient } from 'utils/graphql'
import { getBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import Home from '../views/Home'

const IndexPage = ({ totalTx30Days, addressCount30Days, tvl }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          totalTx30Days,
          addressCount30Days,
          tvl,
        },
      }}
    >
      <Home />
    </SWRConfig>
  )
}

// Values fetched from TheGraph and BitQuery jan 24, 2022
const txCount = 54780336
const addressCount = 4425459
const tvl = 11511781748.920916

export const getStaticProps: GetStaticProps = async () => {
  const totalTxQuery = gql`
    query TotalTransactions($id: ID!, $block: Block_height) {
      pancakeFactory(id: $id, block: $block) {
        totalTransactions
      }
    }
  `

  const days30Ago = sub(new Date(), { days: 30 })

  const results = {
    totalTx30Days: txCount,
    addressCount30Days: addressCount,
    tvl,
  }

  if (process.env.SF_HEADER) {
    try {
      const [days30AgoBlock] = await getBlocksFromTimestamps([getUnixTime(days30Ago)])

      if (!days30AgoBlock) {
        throw new Error('No block found for 30 days ago')
      }

      const totalTx = await infoServerClient.request(totalTxQuery, {
        id: FACTORY_ADDRESS,
      })
      const totalTx30DaysAgo = await infoServerClient.request(totalTxQuery, {
        block: {
          number: days30AgoBlock.number,
        },
        id: FACTORY_ADDRESS,
      })

      if (
        totalTx?.pancakeFactory?.totalTransactions &&
        totalTx30DaysAgo?.pancakeFactory?.totalTransactions &&
        parseInt(totalTx.pancakeFactory.totalTransactions) > parseInt(totalTx30DaysAgo.pancakeFactory.totalTransactions)
      ) {
        results.totalTx30Days =
          parseInt(totalTx.pancakeFactory.totalTransactions) -
          parseInt(totalTx30DaysAgo.pancakeFactory.totalTransactions)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        console.error('Error when fetching total tx count', error)
      }
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
      const result = await bitQueryServerClient.request(usersQuery, {
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
    const response = await fetch('https://openapi.debank.com/v1/protocol?id=bsc_pancakeswap')
    const responseData: DeBankTvlResponse = await response.json()
    results.tvl = responseData.tvl
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error when fetching tvl stats', error)
    }
  }

  return {
    props: results,
    revalidate: 60 * 60 * 24 * 30, // 30 days
  }
}

export default IndexPage
