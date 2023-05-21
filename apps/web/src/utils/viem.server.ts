import { ChainId } from '@pancakeswap/sdk'
import { OnChainProvider } from '@pancakeswap/smart-router/evm'
import { CHAINS } from 'config/chains'
import { SERVER_NODES } from 'config/nodes'
import { createPublicClient, http, PublicClient } from 'viem'

export const viemServerClients = CHAINS.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.id]: createPublicClient({
      chain: cur,
      transport: http(SERVER_NODES[cur.id]),
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
  return viemServerClients[chainId]
}
