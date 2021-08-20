import { client } from 'config/apolloClient'
import gql from 'graphql-tag'
import { Transaction } from 'types'
import { MintResponse, SwapResponse, BurnResponse } from 'data/types'
import { mapMints, mapBurns, mapSwaps } from 'data/helpers'
/**
 * Transactions of the given pool, used on Pool page
 */
const POOL_TRANSACTIONS = gql`
  query poolTransactions($address: Bytes!) {
    mints(first: 35, orderBy: timestamp, orderDirection: desc, where: { pair: $address }) {
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
    swaps(first: 35, orderBy: timestamp, orderDirection: desc, where: { pair: $address }) {
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
    burns(first: 35, orderBy: timestamp, orderDirection: desc, where: { pair: $address }) {
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
  mints: MintResponse[]
  swaps: SwapResponse[]
  burns: BurnResponse[]
}

export default async function fetchPoolTransactions(
  address: string,
): Promise<{ data: Transaction[] | undefined; error: boolean; loading: boolean }> {
  const { data, error, loading } = await client.query<TransactionResults>({
    query: POOL_TRANSACTIONS,
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

  if (loading || !data) {
    return {
      data: undefined,
      error: false,
      loading: true,
    }
  }

  const mints = data.mints.map(mapMints)
  const burns = data.burns.map(mapBurns)
  const swaps = data.swaps.map(mapSwaps)

  return { data: [...mints, ...burns, ...swaps], error: false, loading: false }
}
