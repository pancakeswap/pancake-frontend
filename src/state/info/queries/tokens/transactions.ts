import { TOKEN_BLACKLIST } from 'config/constants/info'
import { gql } from 'graphql-request'
import { mapBurns, mapMints, mapSwaps } from 'state/info/queries/helpers'
import { BurnResponse, MintResponse, SwapResponse } from 'state/info/queries/types'
import { Transaction } from 'state/info/types'
import { infoClient, infoClientETH } from 'utils/graphql'
import { PoolsForTokenResponse, POOLS_FOR_TOKEN_ETH } from './poolsForToken'

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
    mintsAs1: mints(first: 10, orderBy: timestamp, orderDirection: desc, where: { token1: $address }) {
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

const TOKEN_TRANSACTIONS_ETH = (pools: string[]) => {
  const addressesString = `["${pools.join('","')}"]`
  return gql`
    query tokenTransactions {
      mintsAs0: mints(first: 10, orderBy: timestamp, orderDirection: desc, where: { pair_in: ${addressesString} }) {
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
      mintsAs1: mints(first: 10, orderBy: timestamp, orderDirection: desc, where: { pair_in: ${addressesString} }) {
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
      swapsAs0: swaps(first: 10, orderBy: timestamp, orderDirection: desc, where: { pair_in: ${addressesString} }) {
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
        amount0In
        amount1In
        amount0Out
        amount1Out
        amountUSD
      }
      swapsAs1: swaps(first: 10, orderBy: timestamp, orderDirection: desc, where: { pair_in: ${addressesString} }) {
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
        amount0In
        amount1In
        amount0Out
        amount1Out
        amountUSD
      }
      burnsAs0: burns(first: 10, orderBy: timestamp, orderDirection: desc, where: { pair_in: ${addressesString} }) {
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
      burnsAs1: burns(first: 10, orderBy: timestamp, orderDirection: desc, where: { pair_in: ${addressesString} }) {
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
}
interface TransactionResults {
  mintsAs0: MintResponse[]
  mintsAs1: MintResponse[]
  swapsAs0: SwapResponse[]
  swapsAs1: SwapResponse[]
  burnsAs0: BurnResponse[]
  burnsAs1: BurnResponse[]
}

const fetchTokenTransactions = async (address: string): Promise<{ data?: Transaction[]; error: boolean }> => {
  try {
    const data = await infoClient.request<TransactionResults>(TOKEN_TRANSACTIONS, {
      address,
    })
    const mints0 = data.mintsAs0.map(mapMints)
    const mints1 = data.mintsAs1.map(mapMints)

    const burns0 = data.burnsAs0.map(mapBurns)
    const burns1 = data.burnsAs1.map(mapBurns)

    const swaps0 = data.swapsAs0.map(mapSwaps)
    const swaps1 = data.swapsAs1.map(mapSwaps)

    return { data: [...mints0, ...mints1, ...burns0, ...burns1, ...swaps0, ...swaps1], error: false }
  } catch (error) {
    console.error(`Failed to fetch transactions for token ${address}`, error)
    return {
      error: true,
    }
  }
}

export const fetchTokenTransactionsETH = async (address: string): Promise<{ data?: Transaction[]; error: boolean }> => {
  try {
    const pairs = await infoClientETH.request<PoolsForTokenResponse>(POOLS_FOR_TOKEN_ETH, {
      address,
      blacklist: TOKEN_BLACKLIST,
    })
    const targetAddress = pairs.asToken0.concat(pairs.asToken1).map((p) => p.id)
    const data = await infoClientETH.request<TransactionResults>(TOKEN_TRANSACTIONS_ETH(targetAddress))
    const mints0 = data.mintsAs0.map(mapMints)
    const mints1 = data.mintsAs1.map(mapMints)

    const burns0 = data.burnsAs0.map(mapBurns)
    const burns1 = data.burnsAs1.map(mapBurns)

    const swaps0 = data.swapsAs0.map(mapSwaps)
    const swaps1 = data.swapsAs1.map(mapSwaps)

    return { data: [...mints0, ...mints1, ...burns0, ...burns1, ...swaps0, ...swaps1], error: false }
  } catch (error) {
    console.error(`Failed to fetch transactions for token ${address}`, error)
    return {
      error: true,
    }
  }
}

export default fetchTokenTransactions
