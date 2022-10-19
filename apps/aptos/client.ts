import { createClient } from '@pancakeswap/awgmi'
import {
  defaultChain,
  defaultChains,
  MartianConnector,
  PetraConnector,
  PontemConnector,
  FewchaConnector,
  BloctoConnector,
} from '@pancakeswap/awgmi/core'
import { AptosClient } from 'aptos'

export const client = createClient({
  connectors: [
    new PetraConnector(),
    new MartianConnector(),
    new PontemConnector(),
    new FewchaConnector(),
    new BloctoConnector(),
  ],
  provider: ({ networkName }) => {
    const networkNameLowerCase = networkName?.toLowerCase()
    if (networkNameLowerCase) {
      const foundChain = defaultChains.find((c) => c.network === networkNameLowerCase)
      if (foundChain) {
        return new AptosClient(foundChain.nodeUrls.default)
      }
    }

    return new AptosClient(defaultChain.nodeUrls.default)
  },
  autoConnect: true,
})
