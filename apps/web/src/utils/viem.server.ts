import { ChainId } from '@pancakeswap/sdk'
import { OnChainProvider } from '@pancakeswap/smart-router/evm'
import { CHAINS } from 'config/chains'
import { SERVER_NODES } from 'config/nodes'
import { createPublicClient, http } from 'viem'

const clients = CHAINS.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.id]: createPublicClient({
      chain: cur,
      transport: http(SERVER_NODES[cur.id]),
    }),
  }
}, {} as Record<ChainId, ReturnType<typeof createPublicClient>>)

// @ts-ignore
export const viemClients: OnChainProvider = ({ chainId }: { chainId?: ChainId }) => {
  return clients[chainId]
}
