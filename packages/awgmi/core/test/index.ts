import { Account, Ed25519PrivateKey, Aptos, AptosConfig } from '@aptos-labs/ts-sdk'
import { devnet } from '../src/chain'
import { ClientConfig, createClient } from '../src/client'
import { MockConnector } from '../src/connectors/mock'
import { getDefaultProviders } from '../src/providers'

// default generated account for testing
const accounts = [
  {
    privateKey: new Ed25519PrivateKey('0xd7238892323a3440282657b1ebe046c16357521333003783596da9c2cb26a485'),
    address: '0x2cf744dc90acb87c3bbf5f034b37c3718ac10a56e5181c1b43923e5c3623b493',
  },
]

export function getAptosAccounts() {
  return accounts.map((x) => Account.fromPrivateKeyAndAddress(x))
}

class AptosProvider extends Aptos {
  toJSON() {
    return `<AptosProvider url={${this.config.fullnode}} />`
  }
}

export function getAptosClient() {
  return new AptosProvider(new AptosConfig({ fullnode: devnet.nodeUrls.default }))
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
