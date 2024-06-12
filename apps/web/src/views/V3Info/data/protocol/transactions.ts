import type { components } from 'state/info/api/schema'
import { explorerApiClient } from 'state/info/api/client'
import dayjs from 'dayjs'
import { Transaction, TransactionType } from '../../types'

export async function fetchTopTransactions(
  chainName: components['schemas']['ChainName'],
  signal: AbortSignal,
): Promise<Transaction[] | undefined> {
  try {
    const data = await explorerApiClient
      .GET('/cached/tx/v3/{chainName}/recent', {
        signal,
        params: {
          path: {
            chainName,
          },
        },
      })
      .then((res) => res.data)

    if (!data) {
      return undefined
    }

    return data.map((m) => {
      return {
        type:
          m.type === 'mint' ? TransactionType.MINT : m.type === 'burn' ? TransactionType.BURN : TransactionType.SWAP,
        hash: m.transactionHash,
        timestamp: dayjs(m.timestamp as string)
          .unix()
          .toString(),
        sender: m.origin ?? '',
        token0Symbol: m.token0.symbol,
        token1Symbol: m.token1.symbol,
        token0Address: m.token0.id,
        token1Address: m.token1.id,
        amountUSD: parseFloat(m.amountUSD),
        amountToken0: parseFloat(m.amount0),
        amountToken1: parseFloat(m.amount1),
      }
    })
  } catch {
    return undefined
  }
}
