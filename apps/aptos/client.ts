import { createClient, defaultChain, defaultChains } from '@pancakeswap/awgmi'
import { PetraConnector } from '@pancakeswap/awgmi/connectors/petra'
import { MartianConnector } from '@pancakeswap/awgmi/connectors/martian'
import { BloctoConnector } from '@pancakeswap/awgmi/connectors/blocto'
import { PontemConnector } from '@pancakeswap/awgmi/connectors/pontem'
import { FewchaConnector } from '@pancakeswap/awgmi/connectors/fewcha'
import { AptosClient } from 'aptos'

const NODE_REAL_API = process.env.NEXT_PUBLIC_NODE_REAL_API
const NODE_REAL_API_TESTNET = process.env.NEXT_PUBLIC_NODE_REAL_API_TESTNET

const nodeReal = {
  ...(NODE_REAL_API && {
    mainnet: NODE_REAL_API,
  }),
  ...(NODE_REAL_API_TESTNET && {
    testnet: NODE_REAL_API_TESTNET,
  }),
}

export const client = createClient({
  connectors: [
    new PetraConnector(),
    new MartianConnector(),
    new PontemConnector(),
    new FewchaConnector(),
    new BloctoConnector(),
    new PetraConnector({ options: { name: 'Trust Wallet', id: 'trustWallet' } }),
  ],
  provider: ({ networkName }) => {
    const networkNameLowerCase = networkName?.toLowerCase()
    if (networkNameLowerCase) {
      const foundChain = defaultChains.find((c) => c.network === networkNameLowerCase)
      if (foundChain) {
        if (foundChain.nodeUrls.nodeReal && nodeReal[networkNameLowerCase]) {
          return new AptosClient(`${foundChain.nodeUrls.nodeReal}/${nodeReal[networkNameLowerCase]}`, {
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
