import { InputGenerateTransactionOptions, InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk'

import { Chain } from '../chain'
import { ConnectorNotFoundError, ConnectorUnauthorizedError, UserRejectedRequestError } from '../errors'
import { Connector, ConnectorTransactionResponse } from './base'
import { SignMessagePayload, SignMessageResponse } from './types'
import { convertTransactionPayloadToOldFormat } from '../transactions/payloadTransformer'

declare global {
  interface Window {
    fewcha?: any
  }
}

type NetworkEvent = { name: string; network: string }
type AccountEvent = string

function methodWrapper(promiseFn: any) {
  return async (...args: any) => {
    const { data, status, method } = await promiseFn(...args)

    if (status === 401) throw new UserRejectedRequestError(new Error())
    if (status === 403) throw new ConnectorUnauthorizedError()
    if (status === 200) return data

    // status 500
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

      window.addEventListener('aptos#changeNetwork', this.onNetworkChanged)
      window.addEventListener('aptos#changeAccount', this.onAccountsChanged)

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
    window.removeEventListener('aptos#changeNetwork', this.onNetworkChanged)
    window.removeEventListener('aptos#changeAccount', this.onAccountsChanged)
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

  async signAndSubmitTransaction(
    payload: InputGenerateTransactionPayloadData,
    options?: Partial<InputGenerateTransactionOptions>,
  ): Promise<ConnectorTransactionResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    const generatedTx = await methodWrapper(provider.generateTransaction)(
      convertTransactionPayloadToOldFormat(payload),
      options,
    )

    const hash = await methodWrapper(provider.signAndSubmitTransaction)(generatedTx)

    return { hash }
  }

  async signTransaction(payload: InputGenerateTransactionPayloadData) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const transaction = await methodWrapper(provider.generateTransaction)(convertTransactionPayloadToOldFormat(payload))
    return provider.signTransaction(transaction)
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const response = await provider.signMessage(message)

    return response
  }

  protected onAccountsChanged = async (e: Event) => {
    if (e instanceof CustomEvent) {
      const address = (<CustomEvent<AccountEvent>>e).detail

      if (!address) {
        this.emit('disconnect')
      } else {
        this.emit('change', {
          account: await this.account(),
        })
      }
    }
  }

  protected onNetworkChanged = (e: Event) => {
    if (e instanceof CustomEvent) {
      this.emit('change', {
        network: (<CustomEvent<NetworkEvent>>e).detail.name,
      })
    }
  }
}
