import { createClient } from '@pancakeswap/aptos'
import { AptosClient } from 'aptos'
import { MartianConnector, InjectedConnector } from '@pancakeswap/aptos/core'

export const devnetUrl = 'https://fullnode.devnet.aptoslabs.com/'
export const networks: Record<string, string> = {
  // local: 'http://localhost:8080',
  Devnet: devnetUrl,
  Testnet: 'https://testnet.aptoslabs.com',
  AIT3: 'https://ait3.aptosdev.com/',
}

export const client = createClient({
  connectors: [new InjectedConnector(), new MartianConnector()],
  provider(config) {
    if (config?.networkName && config?.networkName in networks) {
      return new AptosClient(networks[config.networkName])
    }
    return new AptosClient(devnetUrl)
  },
  autoConnect: true,
})
