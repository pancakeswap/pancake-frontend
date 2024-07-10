import { ChainId } from '@pancakeswap/chains'
import { CHAINS } from 'config/chains'
import { SERVER_NODES } from 'config/nodes'
import { createPublicClient, fallback, http, PublicClient } from 'viem'

export const viemServerClients = CHAINS.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.id]: createPublicClient({
      chain: cur,
      transport: fallback(
        SERVER_NODES[cur.id as ChainId].map((url) =>
          http(url, {
            timeout: 15_000,
          }),
        ),
      ),
      batch: {
        multicall: {
          batchSize: 1024 * 200,
          wait: 16,
        },
      },
      pollingInterval: 6_000,
    }),
  }
}, {} as Record<ChainId, PublicClient>)

export const getViemClients = ({ chainId }: { chainId: ChainId }) => {
  return viemServerClients[chainId]
}
