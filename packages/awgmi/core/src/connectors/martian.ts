import { Types } from 'aptos'
import { Chain } from '../chain'
import { Connector } from './base'
import { ConnectorNotFoundError, UserRejectedRequestError } from '../errors'
import { Address } from '../types'
import { SignMessagePayload, SignMessageResponse } from './types'

declare global {
  interface Window {
    martian?: any
  }
}

export type MartianConnectorOptions = {
  /** Id of connector */
  id?: string
  /** Name of connector */
  name?: string
}

export class MartianConnector extends Connector<Window['martian'], MartianConnectorOptions> {
  readonly id: string
  readonly name: string
  provider?: Window['martian']

  readonly ready = typeof window !== 'undefined' && !!window.martian
  constructor(config: { chains?: Chain[]; options?: MartianConnectorOptions } = {}) {
    super(config)

    let name = 'Martian'
    const overrideName = config.options?.name
    if (typeof overrideName === 'string') name = overrideName
    this.id = config.options?.id || 'martian'
    this.name = name
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.martian) this.provider = window.martian
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

      const account = await provider.connect()
      const network = await this.network()

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
    return provider.account()
  }

  async network() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.network()
  }

  async isConnected() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      return provider.isConnected()
    } catch {
      return false
    }
  }

  async signAndSubmitTransaction(payload: Types.TransactionPayload, options?: Types.SubmitTransactionRequest) {
    const provider = await this.getProvider()
    const account = await this.account()
    if (!provider) throw new ConnectorNotFoundError()

    try {
      await provider.cancelSubmittedTransactions?.()
    } catch {
      //
    }

    const transaction = await provider.generateTransaction(account?.address || '', payload, options)

    if (!transaction) throw new Error('Failed to generate transaction')

    try {
      const hash = await provider.signAndSubmitTransaction(transaction)

      return { hash }
    } catch (error) {
      if (error === 'User Rejected the request') {
        throw new UserRejectedRequestError(error)
      }
      throw error
    }
  }

  async signTransaction(payload: Types.TransactionPayload) {
    const provider = await this.getProvider()
    const account = await this.account()
    if (!provider) throw new ConnectorNotFoundError()
    const transaction = await provider.generateTransaction(account?.address || '', payload)
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
