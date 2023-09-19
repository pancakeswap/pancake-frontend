import { createPublicClient, http } from 'viem'
import { polygon } from 'viem/chains'

export const polygonRpcProvider = createPublicClient({
  transport: http(),
  chain: polygon,
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})
