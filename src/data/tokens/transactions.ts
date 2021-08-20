import { client } from 'config/apolloClient'
import gql from 'graphql-tag'
import { Transaction } from 'types'
import { MintResponse, SwapResponse, BurnResponse } from 'data/types'
import { mapMints, mapBurns, mapSwaps } from 'data/helpers'

/**
 * Data to display transaction table on Token page
 */
const TOKEN_TRANSACTIONS = gql`
  query tokenTransactions($address: Bytes!) {
    mintsAs0: mints(first: 10, orderBy: timestamp, orderDirection: desc, where: { token0: $address }) {
      id
      timestamp
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      to
      amount0
      amount1
      amountUSD
    }
    mintsAs1: mints(first: 10, orderBy: timestamp, orderDirection: desc, where: { token0: $address }) {
      id
      timestamp
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      to
      amount0
      amount1
      amountUSD
    }
    swapsAs0: swaps(first: 10, orderBy: timestamp, orderDirection: desc, where: { token0: $address }) {
      id
      timestamp
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      from
      amount0In
      amount1In
      amount0Out
      amount1Out
      amountUSD
    }
    swapsAs1: swaps(first: 10, orderBy: timestamp, orderDirection: desc, where: { token1: $address }) {
      id
      timestamp
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      from
      amount0In
      amount1In
      amount0Out
      amount1Out
      amountUSD
    }
    burnsAs0: burns(first: 10, orderBy: timestamp, orderDirection: desc, where: { token0: $address }) {
      id
      timestamp
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      sender
      amount0
      amount1
      amountUSD
    }
    burnsAs1: burns(first: 10, orderBy: timestamp, orderDirection: desc, where: { token1: $address }) {
      id
      timestamp
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      sender
      amount0
      amount1
      amountUSD
    }
  }
`

interface TransactionResults {
  mintsAs0: MintResponse[]
  mintsAs1: MintResponse[]
  swapsAs0: SwapResponse[]
  swapsAs1: SwapResponse[]
  burnsAs0: BurnResponse[]
  burnsAs1: BurnResponse[]
}

export default async function fetchTokenTransactions(
  address: string,
): Promise<{ data: Transaction[] | undefined; error: boolean; loading: boolean }> {
  try {
    const { data, error, loading } = await client.query<TransactionResults>({
      query: TOKEN_TRANSACTIONS,
      variables: {
        address,
      },
      fetchPolicy: 'cache-first',
    })

    if (error) {
      return {
        data: undefined,
        error: true,
        loading: false,
      }
    }

    if (loading && !data) {
      return {
        data: undefined,
        error: false,
        loading: true,
      }
    }

    const mints0 = data.mintsAs0.map(mapMints)
    const mints1 = data.mintsAs1.map(mapMints)

    const burns0 = data.burnsAs0.map(mapBurns)
    const burns1 = data.burnsAs1.map(mapBurns)

    const swaps0 = data.swapsAs0.map(mapSwaps)
    const swaps1 = data.swapsAs1.map(mapSwaps)

    return { data: [...mints0, ...mints1, ...burns0, ...burns1, ...swaps0, ...swaps1], error: false, loading: false }
  } catch {
    return {
      data: undefined,
      error: true,
      loading: false,
    }
  }
}
