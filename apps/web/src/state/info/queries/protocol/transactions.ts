import { gql } from 'graphql-request'
import { mapBurns, mapMints, mapSwaps } from 'state/info/queries/helpers'
import { BurnResponse, MintResponse, SwapResponse } from 'state/info/queries/types'
import { Transaction } from 'state/info/types'
import { infoClient } from 'utils/graphql'

/**
 * Transactions for Transaction table on the Home page
 */
const GLOBAL_TRANSACTIONS = gql`
  query overviewTransactions {
    mints: mints(first: 33, orderBy: timestamp, orderDirection: desc) {
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
    swaps: swaps(first: 33, orderBy: timestamp, orderDirection: desc) {
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
    burns: burns(first: 33, orderBy: timestamp, orderDirection: desc) {
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

const fetchTopTransactions = async (): Promise<Transaction[] | undefined> => {
  try {
    const data = await infoClient.request<TransactionResults>(GLOBAL_TRANSACTIONS)

    if (!data) {
      return undefined
    }

    const mints = data.mints.map(mapMints)
    const burns = data.burns.map(mapBurns)
    const swaps = data.swaps.map(mapSwaps)

    return [...mints, ...burns, ...swaps].sort((a, b) => {
      return parseInt(b.timestamp, 10) - parseInt(a.timestamp, 10)
    })
  } catch {
    return undefined
  }
}

export default fetchTopTransactions
