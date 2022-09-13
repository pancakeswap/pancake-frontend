import { createClient } from '@pancakeswap/awgmi'
import { AptosClient } from 'aptos'
import { MartianConnector, PetraConnector } from '@pancakeswap/awgmi/core'
import { defaultChain, chains } from 'config/chains'

export const client = createClient({
  connectors: [new PetraConnector(), new MartianConnector()],
  provider(config) {
    if (config?.networkName) {
      const foundChain = chains.find((c) => c.name === config.networkName?.toLowerCase())
      if (foundChain) {
        return new AptosClient(foundChain?.rpcUrls.default)
      }
    }
    return new AptosClient(defaultChain.rpcUrls.default)
  },
  autoConnect: true,
})
