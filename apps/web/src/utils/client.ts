import { CHAINS } from 'config/chains'
import { PUBLIC_NODES } from 'config/nodes'
import { configureChains } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// get most configs chain nodes length
const mostNodesConfig = Object.values(PUBLIC_NODES).reduce((prev, cur) => {
  return cur.length > prev ? cur.length : prev
}, 0)

export const { publicClient, chains } = configureChains(
  CHAINS,
  Array.from({ length: mostNodesConfig })
    .map((_, i) => i)
    .map((i) => {
      return jsonRpcProvider({
        rpc: (chain) => {
          if (process.env.NODE_ENV === 'test' && chain.id === mainnet.id && i === 0) {
            return { http: 'https://ethereum.publicnode.com' }
          }
          return PUBLIC_NODES[chain.id]?.[i]
            ? {
                http: PUBLIC_NODES[chain.id][i],
              }
            : null
        },
      })
    }),
  {
    batch: {
      multicall: {
        batchSize: 1024 * 200,
        wait: 16,
      },
    },
    pollingInterval: 6_000,
  },
)
