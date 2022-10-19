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

const NODE_REAL_API = process.env.NEXT_PUBLIC_NODE_REAL_API
const NODE_REAL_API_TESTNET = process.env.NEXT_PUBLIC_NODE_REAL_API_TESTNET

const nodeReal = {
  ...(NODE_REAL_API && {
    mainnet: {
      USERNAME: '78388953-02da-4baa-8911-b35c9b48d5bf',
      PASSWORD: NODE_REAL_API,
    },
  }),
  ...(NODE_REAL_API_TESTNET && {
    testnet: {
      USERNAME: '974c6552-9ff8-44c2-a235-465d4978a52d',
      PASSWORD: NODE_REAL_API_TESTNET,
    },
  }),
}

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
        if (foundChain.nodeUrls.nodeReal && nodeReal[networkNameLowerCase]) {
          return new AptosClient(foundChain.nodeUrls.nodeReal, {
            ...nodeReal[networkNameLowerCase],
            WITH_CREDENTIALS: false,
          })
        }
        return new AptosClient(foundChain.nodeUrls.default)
      }
    }

    return new AptosClient(defaultChain.nodeUrls.default)
  },
  autoConnect: true,
})
