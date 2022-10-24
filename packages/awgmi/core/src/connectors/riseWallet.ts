import { Chain } from '../chain'
import { ConnectorNotFoundError, UserRejectedRequestError } from '../errors'
import { Connector } from './base'

declare global {
  interface Window {
    rise?: any
  }
}

export class RiseWalletConnector extends Connector<any, any> {
  readonly id = 'riseWallet'

  readonly name = 'Rise Wallet'
  readonly ready = typeof window !== 'undefined' && !!window.rise && window.rise?.isRise
  provider?: any

  constructor(config: { chains?: Chain[] } = {}) {
    super(config)
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.rise) this.provider = window.rise
    return this.provider
  }

  async connect() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      if (provider.on) {
        provider.on('onAccountChange', this.onAccountsChanged)
        provider.on('onNetworkChange', this.onNetworkChanged)
        provider.on('onDisconnect', this.onDisconnect)
      }

      const isConnected = await provider.connect()
      if (!isConnected) {
        throw new UserRejectedRequestError(new Error())
      }
      // const network = await this.network() // no network yet?

      this.emit('message', { type: 'connecting' })
      return {
        account: {
          address: provider.address,
        },
        network: 'Devnet',
        provider,
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
