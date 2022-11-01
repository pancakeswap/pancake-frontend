import { gql } from 'graphql-request'
import { mapBurns, mapMints, mapSwaps, getPairTokenMap } from 'state/info/queries/helpers'
import { BurnResponse, MintResponse, SwapResponse } from 'state/info/queries/types'
import { Transaction } from 'state/info/types'
import { MultiChainName, getMultiChainQueryEndPointWithStableSwap } from '../../constant'
/**
 * Transactions of the given pool, used on Pool page
 */
const POOL_TRANSACTIONS = gql`
  query poolTransactions($address: Bytes!) {
    mints(first: 35, orderBy: timestamp, orderDirection: desc, where: { pair: $address }) {
      id
      timestamp
      to
      amount0
      amount1
      amountUSD
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
    }
    burns(first: 35, orderBy: timestamp, orderDirection: desc, where: { pair: $address }) {
      id
      timestamp
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
    const pairTokenMap = await getPairTokenMap([address], chainName)
    const pairTokens = pairTokenMap[address]
    const pairResponse = pairTokens ? { pair: pairTokens } : {}

    const mints = data.mints.map((mint) => ({ ...mint, ...pairResponse })).map(mapMints)
    const burns = data.burns.map((burn) => ({ ...burn, ...pairResponse })).map(mapBurns)
    const swaps = data.swaps.map((swap) => ({ ...swap, ...pairResponse })).map(mapSwaps)
    return { data: [...mints, ...burns, ...swaps], error: false }
  } catch (error) {
    console.error(`Failed to fetch transactions for pool ${address}`, error)
    return {
      error: true,
    }
  }
}

export default fetchPoolTransactions
