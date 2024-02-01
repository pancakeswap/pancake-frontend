import { CHAINS } from 'config/chains'
// import { configureChains } from 'wagmi'
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { viemClients } from './viem'

// // get most configs chain nodes length
// const mostNodesConfig = Object.values(PUBLIC_NODES).reduce((prev, cur) => {
//   return cur.length > prev ? cur.length : prev
// }, 0)

export const publicClient = ({ chainId }: { chainId: number }) => viemClients[chainId]

export const chains = CHAINS
