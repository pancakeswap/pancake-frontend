import { ChainId } from '@pancakeswap/sdk'
import { OnChainProvider } from '@pancakeswap/smart-router/evm'
import { CHAINS } from 'config/chains'
import { PUBLIC_NODES } from 'config/nodes'
import { createPublicClient, http, fallback, PublicClient } from 'viem'

const viemClients = CHAINS.reduce((prev, cur) => {
  const isSingle = !Array.isArray(PUBLIC_NODES[cur.id])
  const transport = isSingle
    ? http(PUBLIC_NODES[cur.id] as string, {
        timeout: 15_000,
      })
    : fallback(
        (PUBLIC_NODES[cur.id] as string[]).map((url) =>
          http(url, {
            timeout: 15_000,
          }),
        ),
        {
          rank: false,
        },
      )
  return {
    ...prev,
    [cur.id]: createPublicClient({
      chain: cur,
      transport,
      batch: {
        multicall: {
          batchSize: 1024 * 200,
        },
      },
    }),
  }
}, {} as Record<ChainId, PublicClient>)

// @ts-ignore
export const getViemClients: OnChainProvider = ({ chainId }: { chainId?: ChainId }) => {
  return viemClients[chainId]
}
