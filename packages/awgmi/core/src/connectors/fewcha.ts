import { Types } from 'aptos'
import { Chain } from '../chain'
import { Connector, ConnectorTransactionResponse } from './base'
import { ConnectorNotFoundError } from '../errors'
import { Address } from '../types'
import { SignMessagePayload, SignMessageResponse } from './types'

declare global {
  interface Window {
    fewcha?: any
  }
}

function methodWrapper(promiseFn: any) {
  return async (...args: any) => {
    const { data, status, method } = await promiseFn(...args)

    if (status === 200) return data

    throw new Error(`Fewcha ${method} method: ${data?.message || data}`)
  }
}

export class FewchaConnector extends Connector {
  readonly id = 'fewcha'
  readonly name = 'Fewcha'
  provider?: Window['fewcha']

  readonly ready = typeof window !== 'undefined' && !!window.fewcha
  constructor(config: { chains?: Chain[] } = {}) {
    super(config)
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.fewcha) this.provider = window.fewcha
    return this.provider
  }

  async connect() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      if (provider.onAccountChange) {
        provider.onAccountChange(this.onAccountsChanged)
      }
      if (provider.onNetworkChange) {
        provider.onNetworkChange(this.onNetworkChanged)
      }

      this.emit('message', { type: 'connecting' })

      const { data: account } = await provider.connect()
      const { data: network } = await provider.getNetwork()

      return {
        account,
        network,
        provider,
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider) return
    // eslint-disable-next-line consistent-return
    return provider.disconnect()
  }

  async account() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return methodWrapper(provider.account)()
  }

  async network() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return methodWrapper(provider.getNetwork)()
  }

  async isConnected() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      return methodWrapper(provider.isConnected)()
    } catch {
      return false
    }
  }

  async signAndSubmitTransaction(payload: Types.EntryFunctionPayload): Promise<ConnectorTransactionResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    const generatedTx = await methodWrapper(provider.generateTransaction)(payload)

    const hash = await methodWrapper(provider.signAndSubmitTransaction)(generatedTx)

    return { hash }
  }

  async signTransaction(payload: Types.EntryFunctionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const transaction = await methodWrapper(provider.generateTransaction)(payload)
    return provider.signTransaction(transaction)
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const response = await provider.signMessage(message)

    return response
  }

  protected onAccountsChanged = async (address: Address) => {
    if (!address) {
      this.emit('disconnect')
    } else {
      this.emit('change', {
        account: await this.account(),
      })
    }
  }

  protected onNetworkChanged = (network: string) => {
    this.emit('change', {
      network,
    })
  }
}
