import { gql, GraphQLClient } from 'graphql-request'
import { Transaction, TransactionType } from '../../types'

const GLOBAL_TRANSACTIONS = gql`
  query transactions($address: String!) {
    mintsAs0: mints(first: 500, orderBy: timestamp, orderDirection: desc, where: { token0: $address }) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      owner
      sender
      origin
      amount0
      amount1
      amountUSD
    }
    mintsAs1: mints(first: 500, orderBy: timestamp, orderDirection: desc, where: { token0: $address }) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      owner
      sender
      origin
      amount0
      amount1
      amountUSD
    }
    swapsAs0: swaps(first: 500, orderBy: timestamp, orderDirection: desc, where: { token0: $address }) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      origin
      amount0
      amount1
      amountUSD
    }
    swapsAs1: swaps(first: 500, orderBy: timestamp, orderDirection: desc, where: { token1: $address }) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      origin
      amount0
      amount1
      amountUSD
    }
    burnsAs0: burns(first: 500, orderBy: timestamp, orderDirection: desc, where: { token0: $address }) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      owner
      origin
      amount0
      amount1
      amountUSD
    }
    burnsAs1: burns(first: 500, orderBy: timestamp, orderDirection: desc, where: { token1: $address }) {
      timestamp
      transaction {
        id
      }
      pool {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      owner
      origin
      amount0
      amount1
      amountUSD
    }
  }
`

interface TransactionResults {
  mintsAs0: {
    timestamp: string
    transaction: {
      id: string
    }
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  mintsAs1: {
    timestamp: string
    transaction: {
      id: string
    }
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  swapsAs0: {
    timestamp: string
    transaction: {
      id: string
    }
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  swapsAs1: {
    timestamp: string
    transaction: {
      id: string
    }
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  burnsAs0: {
    timestamp: string
    transaction: {
      id: string
    }
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    owner: string
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  burnsAs1: {
    timestamp: string
    transaction: {
      id: string
    }
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    owner: string
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
}

export async function fetchTokenTransactions(
  address: string,
  client: GraphQLClient,
): Promise<{ data: Transaction[] | undefined; error: boolean; loading: boolean }> {
  try {
    const data = await client.request<TransactionResults>(GLOBAL_TRANSACTIONS, {
      address,
    })

    const mints0 = data.mintsAs0.map((m) => {
      return {
        type: TransactionType.MINT,
        hash: m.transaction.id,
        timestamp: m.timestamp,
        sender: m.origin,
        token0Symbol: m.pool.token0.symbol,
        token1Symbol: m.pool.token1.symbol,
        token0Address: m.pool.token0.id,
        token1Address: m.pool.token1.id,
        amountUSD: parseFloat(m.amountUSD),
        amountToken0: parseFloat(m.amount0),
        amountToken1: parseFloat(m.amount1),
      }
    })
    const mints1 = data.mintsAs1.map((m) => {
      return {
        type: TransactionType.MINT,
        hash: m.transaction.id,
        timestamp: m.timestamp,
        sender: m.origin,
        token0Symbol: m.pool.token0.symbol,
        token1Symbol: m.pool.token1.symbol,
        token0Address: m.pool.token0.id,
        token1Address: m.pool.token1.id,
        amountUSD: parseFloat(m.amountUSD),
        amountToken0: parseFloat(m.amount0),
        amountToken1: parseFloat(m.amount1),
      }
    })

    const burns0 = data.burnsAs0.map((m) => {
      return {
        type: TransactionType.BURN,
        hash: m.transaction.id,
        timestamp: m.timestamp,
        sender: m.origin,
        token0Symbol: m.pool.token0.symbol,
        token1Symbol: m.pool.token1.symbol,
        token0Address: m.pool.token0.id,
        token1Address: m.pool.token1.id,
        amountUSD: parseFloat(m.amountUSD),
        amountToken0: parseFloat(m.amount0),
        amountToken1: parseFloat(m.amount1),
      }
    })
    const burns1 = data.burnsAs1.map((m) => {
      return {
        type: TransactionType.BURN,
        hash: m.transaction.id,
        timestamp: m.timestamp,
        sender: m.origin,
        token0Symbol: m.pool.token0.symbol,
        token1Symbol: m.pool.token1.symbol,
        token0Address: m.pool.token0.id,
        token1Address: m.pool.token1.id,
        amountUSD: parseFloat(m.amountUSD),
        amountToken0: parseFloat(m.amount0),
        amountToken1: parseFloat(m.amount1),
      }
    })

    const swaps0 = data.swapsAs0.map((m) => {
      return {
        type: TransactionType.SWAP,
        hash: m.transaction.id,
        timestamp: m.timestamp,
        sender: m.origin,
        token0Symbol: m.pool.token0.symbol,
        token1Symbol: m.pool.token1.symbol,
        token0Address: m.pool.token0.id,
        token1Address: m.pool.token1.id,
        amountUSD: parseFloat(m.amountUSD),
        amountToken0: parseFloat(m.amount0),
        amountToken1: parseFloat(m.amount1),
      }
    })

    const swaps1 = data.swapsAs1.map((m) => {
      return {
        type: TransactionType.SWAP,
        hash: m.transaction.id,
        timestamp: m.timestamp,
        sender: m.origin,
        token0Symbol: m.pool.token0.symbol,
        token1Symbol: m.pool.token1.symbol,
        token0Address: m.pool.token0.id,
        token1Address: m.pool.token1.id,
        amountUSD: parseFloat(m.amountUSD),
        amountToken0: parseFloat(m.amount0),
        amountToken1: parseFloat(m.amount1),
      }
    })

    return { data: [...mints0, ...mints1, ...burns0, ...burns1, ...swaps0, ...swaps1], error: false, loading: false }
  } catch {
    return {
      data: undefined,
      error: true,
      loading: false,
    }
  }
}
