import { gql } from 'graphql-request'
import { mapBurns, mapMints, mapSwaps } from 'state/info/queries/helpers'
import { BurnResponse, MintResponse, SwapResponse } from 'state/info/queries/types'
import { Transaction } from 'state/info/types'
import { MultiChainName, getMultiChainQueryEndPointWithStableSwap } from '../../constant'
/**
 * Transactions of the given pool, used on Pool page
 */
const POOL_TRANSACTIONS = gql`
  query poolTransactions($address: ID!) {
    mints(first: 35, orderBy: timestamp, orderDirection: desc, where: { pair: $address }) {
      id
      timestamp
      to
      amount0
      amount1
      amountUSD
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
    }
    swaps(first: 35, orderBy: timestamp, orderDirection: desc, where: { pair: $address }) {
      id
      timestamp
      from
      amount0In
      amount1In
      amount0Out
      amount1Out
      amountUSD
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
    }
    burns(first: 35, orderBy: timestamp, orderDirection: desc, where: { pair: $address }) {
      id
      timestamp
      sender
      amount0
      amount1
      amountUSD
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
    }
  }
`

interface TransactionResults {
  mints: MintResponse[]
  swaps: SwapResponse[]
  burns: BurnResponse[]
}

const fetchPoolTransactions = async (
  chainName: MultiChainName,
  address: string,
): Promise<{ data?: Transaction[]; error: boolean }> => {
  try {
    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<TransactionResults>(
      POOL_TRANSACTIONS,
      {
        address,
      },
    )
    const mints = data.mints.map(mapMints)
    const burns = data.burns.map(mapBurns)
    const swaps = data.swaps.map(mapSwaps)
    return { data: [...mints, ...burns, ...swaps], error: false }
  } catch (error) {
    console.error(`Failed to fetch transactions for pool ${address}`, error)
    return {
      error: true,
    }
  }
}

export default fetchPoolTransactions
