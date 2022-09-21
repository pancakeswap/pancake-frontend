import { AptosAccount, AptosClient } from 'aptos'
import { devnet } from '../chain'
import { ClientConfig, createClient } from '../client'
import { MockConnector } from '../connectors/mock'
import { getDefaultProviders } from '../provider'

// default generated account for testing
const accounts = [
  {
    privateKeyHex: '0xd7238892323a3440282657b1ebe046c16357521333003783596da9c2cb26a485',
    address: '0x2cf744dc90acb87c3bbf5f034b37c3718ac10a56e5181c1b43923e5c3623b493',
  },
]

export function getAptosAccounts() {
  return accounts.map((x) => AptosAccount.fromAptosAccountObject(x))
}

class AptosProvider extends AptosClient {
  toJSON() {
    return `<AptosProvider url={${this.client.general.httpRequest.config.BASE}} />`
  }
}

export function getAptosClient() {
  return new AptosProvider(devnet.rpcUrls.default)
}

export function setupClient(config: Partial<ClientConfig> = {}) {
  return createClient({
    connectors: [
      new MockConnector({
        options: {
          account: getAptosAccounts()[0],
        },
      }),
    ],
    provider: getDefaultProviders,
    ...config,
  })
}
