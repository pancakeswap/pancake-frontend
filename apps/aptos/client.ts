import { createClient } from '@pancakeswap/awgmi'
import { BloctoConnector } from '@pancakeswap/awgmi/connectors/blocto'
import { FewchaConnector } from '@pancakeswap/awgmi/connectors/fewcha'
import { MartianConnector } from '@pancakeswap/awgmi/connectors/martian'
import { MsafeConnector } from '@pancakeswap/awgmi/connectors/msafe'
import { PetraConnector } from '@pancakeswap/awgmi/connectors/petra'
import { PontemConnector } from '@pancakeswap/awgmi/connectors/pontem'
import { RiseConnector } from '@pancakeswap/awgmi/connectors/rise'
import { SafePalConnector } from '@pancakeswap/awgmi/connectors/safePal'
import { Aptos, AptosConfig } from '@aptos-labs/ts-sdk'
import { chains, defaultChain } from 'config/chains'

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

export const msafeConnector = new MsafeConnector({ chains })

export const client = createClient({
  connectors: [
    new PetraConnector({ chains }),
    new MartianConnector({ chains }),
    new PontemConnector({ chains }),
    new FewchaConnector({ chains }),
    new BloctoConnector({ chains, options: { appId: 'e2f2f0cd-3ceb-4dec-b293-bb555f2ed5af' } }),
    new PetraConnector({ chains, options: { name: 'Trust Wallet', id: 'trustWallet' } }),
    new SafePalConnector({ chains }),
    new RiseConnector({ chains }),
    msafeConnector,
  ],
  provider: ({ networkName }) => {
    const networkNameLowerCase = networkName?.toLowerCase()
    if (networkNameLowerCase) {
      const foundChain = chains.find((c) => c.network === networkNameLowerCase)
      if (foundChain) {
        if (foundChain.nodeUrls.nodeReal && nodeReal[networkNameLowerCase]) {
          return new Aptos(
            new AptosConfig({
              fullnode: `${foundChain.nodeUrls.nodeReal}/${nodeReal[networkNameLowerCase]}`,
              clientConfig: {
                WITH_CREDENTIALS: false,
              },
            }),
          )
        }
        return new Aptos(
          new AptosConfig({
            fullnode: foundChain.nodeUrls.default,
          }),
        )
      }
    }

    return new Aptos(
      new AptosConfig({
        fullnode: defaultChain.nodeUrls.default,
      }),
    )
  },
  autoConnect: false,
})
