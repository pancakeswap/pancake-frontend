import { createClient } from '@pancakeswap/awgmi'
import { AptosClient } from 'aptos'
import { MartianConnector, PetraConnector } from '@pancakeswap/awgmi/core'
import { defaultChain, chains } from 'config/chains'
import { equalsIgnoreCase } from '@pancakeswap/utils/equalsIgnoreCase'

export const client = createClient({
  connectors: [new PetraConnector(), new MartianConnector()],
  provider(config) {
    if (config?.networkName) {
      const foundChain = chains.find((c) => equalsIgnoreCase(c.name, config.networkName))
      if (foundChain) {
        return new AptosClient(foundChain?.rpcUrls.default)
      }
    }
    return new AptosClient(defaultChain.rpcUrls.default)
  },
  autoConnect: true,
})
