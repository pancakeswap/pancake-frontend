import { ChainId } from '@pancakeswap/chains'
import { PublicClient, createPublicClient, http } from 'viem'
import { CHAINS } from './constants/chains'

export const viemClients: Record<ChainId, PublicClient> = CHAINS.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.id]: createPublicClient({
      chain: cur,
      transport: http(),
      batch: {
        multicall: {
          batchSize: 1024 * 200,
        },
      },
    }),
  }
}, {} as Record<ChainId, PublicClient>)

export const getPublicClient = ({ chainId }: { chainId?: ChainId }) => {
  return viemClients[chainId!]
}
