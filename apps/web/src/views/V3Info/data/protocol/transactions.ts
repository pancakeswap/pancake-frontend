import { gql, GraphQLClient } from 'graphql-request'
import { Transaction, TransactionType } from '../../types'

const GLOBAL_TRANSACTIONS = gql`
  query transactions {
    transactions(first: 500, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      mints {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
        owner
        sender
        origin
        amount0
        amount1
        amountUSD
      }
      swaps {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
        origin
        amount0
        amount1
        amountUSD
      }
      burns {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
        owner
        origin
        amount0
        amount1
        amountUSD
      }
    }
  }
`

type TransactionEntry = {
  timestamp: string
  id: string
  mints: {
    token0: {
      id: string
      symbol: string
    }
    token1: {
      id: string
      symbol: string
    }
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  swaps: {
    token0: {
      id: string
      symbol: string
    }
    token1: {
      id: string
      symbol: string
    }
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  burns: {
    token0: {
      id: string
      symbol: string
    }
    token1: {
      id: string
      symbol: string
    }
    owner: string
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
}

interface TransactionResults {
  transactions: TransactionEntry[]
}

export async function fetchTopTransactions(client: GraphQLClient): Promise<Transaction[] | undefined> {
  try {
    const data = await client.request<TransactionResults>(GLOBAL_TRANSACTIONS)

    if (!data) {
      return undefined
    }

    const formatted = data.transactions.reduce((accum: Transaction[], t: TransactionEntry) => {
      const mintEntries = t.mints.map((m) => {
        return {
          type: TransactionType.MINT,
          hash: t.id,
          timestamp: t.timestamp,
          sender: m.origin,
          token0Symbol: m.token0.symbol,
          token1Symbol: m.token1.symbol,
          token0Address: m.token0.id,
          token1Address: m.token1.id,
          amountUSD: parseFloat(m.amountUSD),
          amountToken0: parseFloat(m.amount0),
          amountToken1: parseFloat(m.amount1),
        }
      })
      const burnEntries = t.burns.map((m) => {
        return {
          type: TransactionType.BURN,
          hash: t.id,
          timestamp: t.timestamp,
          sender: m.origin,
          token0Symbol: m.token0.symbol,
          token1Symbol: m.token1.symbol,
          token0Address: m.token0.id,
          token1Address: m.token1.id,
          amountUSD: parseFloat(m.amountUSD),
          amountToken0: parseFloat(m.amount0),
          amountToken1: parseFloat(m.amount1),
        }
      })

      const swapEntries = t.swaps.map((m) => {
        return {
          hash: t.id,
          type: TransactionType.SWAP,
          timestamp: t.timestamp,
          sender: m.origin,
          token0Symbol: m.token0.symbol,
          token1Symbol: m.token1.symbol,
          token0Address: m.token0.id,
          token1Address: m.token1.id,
          amountUSD: parseFloat(m.amountUSD),
          amountToken0: parseFloat(m.amount0),
          amountToken1: parseFloat(m.amount1),
        }
      })
      // eslint-disable-next-line no-param-reassign
      accum = [...accum, ...mintEntries, ...burnEntries, ...swapEntries]
      return accum
    }, [])

    return formatted
  } catch {
    return undefined
  }
}
