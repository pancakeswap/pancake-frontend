import { Types } from 'aptos'
import { Chain } from '../chain'
import { Connector } from './base'
import { ConnectorNotFoundError } from '../errors'
import { Address } from '../types'

declare global {
  interface Window {
    fewcha?: any
  }
}

function methodWrapper(promiseFn: any) {
  return async (...args: any) => {
    const { data, status, method } = await promiseFn(...args)

    if (status === 200) return data

    throw new Error(`Fewcha ${method} method: ${data}`)
  }
}

export class FewchaConnector extends Connector {
  readonly id = 'fewcha'
  readonly name = 'Fewcha'
  provider?: Window['fewcha']

  readonly ready = typeof window !== 'undefined' && !!window.fewcha
  constructor(chains?: Chain[]) {
    super({
      chains,
    })
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

      const { data: account } = await provider.connect()
      const { data: network } = await provider.getNetwork()

      this.emit('message', { type: 'connecting' })

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

  async signAndSubmitTransaction(payload: Types.EntryFunctionPayload): Promise<Types.PendingTransaction> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    const generatedTx = await methodWrapper(provider.generateTransaction)(payload)

    const hash = await methodWrapper(provider.signAndSubmitTransaction)(generatedTx)

    const tx = await methodWrapper(provider.sdk.getTransactionByHash)(hash)

    return tx
  }

  async signTransaction(payload: Types.EntryFunctionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const transaction = await methodWrapper(provider.generateTransaction)(payload)
    return provider.signTransaction(transaction)
  }

  protected onAccountsChanged = (address: Address) => {
    this.emit('change', {
      account: {
        address,
      },
    })
  }

  protected onNetworkChanged = (network: string) => {
    this.emit('change', {
      network,
    })
  }
}
