import { createMulticall, Call } from '@pancakeswap/multicall'
import { CHAINS } from 'config/chains'
import { SERVER_NODES } from 'config/nodes'
import { configureChains } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

export const { publicClient, chains } = configureChains(CHAINS, [
  jsonRpcProvider({
    rpc: (chain) => {
      return SERVER_NODES[chain.id] ? { http: SERVER_NODES[chain.id] } : { http: chain.rpcUrls.default.http[0] }
    },
  }),
])

export type { Call }

const { multicall, multicallv2 } = createMulticall(publicClient)

export default multicall

export { multicallv2 }
