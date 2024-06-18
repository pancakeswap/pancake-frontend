import { explorerApiClient } from 'state/info/api/client'
import dayjs from 'dayjs'
import { components } from 'state/info/api/schema'
import { Transaction, TransactionType } from '../../types'

export async function fetchPoolTransactions(
  address: string,
  chainName: components['schemas']['ChainName'],
  signal: AbortSignal,
): Promise<{ data: Transaction[] | undefined; error: boolean }> {
  try {
    const data = await explorerApiClient
      .GET('/cached/tx/v3/{chainName}/recent', {
        signal,
        params: {
          path: {
            chainName,
          },
          query: {
            pool: address,
          },
        },
      })
      .then((res) => res.data)

    return {
      data: data?.map((m) => {
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
      }),
      error: false,
    }
  } catch (e) {
    console.error(e)
    return { data: undefined, error: true }
  }
}
