import { createClient } from '@pancakeswap/awgmi'
import { defaultChain, defaultChains, MartianConnector, PetraConnector, PontemConnector } from '@pancakeswap/awgmi/core'
import { AptosClient } from 'aptos'

export const client = createClient({
  connectors: [new PetraConnector(), new MartianConnector(), new PontemConnector()],
  provider: ({ networkName }) => {
    const networkNameLowerCase = networkName?.toLowerCase()
    if (networkNameLowerCase) {
      const foundChain = defaultChains.find((c) => c.network === networkNameLowerCase)
      if (foundChain) {
        return new AptosClient(foundChain.restUrls.default)
      }
    }

    return new AptosClient(defaultChain.restUrls.default)
  },
  autoConnect: true,
})
