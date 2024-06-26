import { Aptos, InputGenerateTransactionOptions, InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk'

import { Chain } from '../chain'
import { ConnectorNotFoundError, UserRejectedRequestError } from '../errors'
import { Address } from '../types'
import { Connector } from './base'
import { SignMessagePayload, SignMessageResponse } from './types'
import { convertTransactionPayloadToOldFormat } from '../transactions/payloadTransformer'

type NetworkInfo = {
  api: string
  name: string
  chainId: string
}

declare global {
  interface Window {
    pontem?: {
      connect: () => Promise<any>
      account(): Promise<Address>
      publicKey(): Promise<string>
      signAndSubmit(
        transaction: InputGenerateTransactionPayloadData,
        options?: any,
      ): Promise<{
        success: boolean
        result: {
          hash: string
        }
      }>
      isConnected(): Promise<boolean>
      signTransaction(
        transaction: InputGenerateTransactionPayloadData,
        options?: any,
      ): Promise<ReturnType<Aptos['transaction']['sign']>>
      signMessage(message: SignMessagePayload): Promise<{
        success: boolean
        result: SignMessageResponse
      }>
      disconnect(): Promise<void>
      network(): Promise<NetworkInfo>
      onAccountChange(listener: (address: Address) => void): Promise<void>
      onNetworkChange(listener: (network: NetworkInfo) => void): Promise<void>
    }
  }
}

export class PontemConnector extends Connector<Window['pontem']> {
  readonly id = 'pontem'
  readonly name = 'Pontem'

  readonly ready = typeof window !== 'undefined' && !!window.pontem

  provider?: Window['pontem']

  constructor(config: { chains?: Chain[] } = {}) {
    super(config)
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.pontem) this.provider = window.pontem
    return this.provider
  }

  async connect() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      if (provider.onAccountChange) provider.onAccountChange(this.onAccountsChanged)
      if (provider.onNetworkChange) provider.onNetworkChange(this.onNetworkChanged)

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

  async network() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const providerNetwork = await provider.network()
    const chain = this.chains.find((c) => c.id === parseInt(providerNetwork.chainId, 10))

    return chain?.network ?? ''
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
    return {
      address: await provider.account(),
      publicKey: await provider.publicKey(),
    }
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

  async signAndSubmitTransaction(
    payload: InputGenerateTransactionPayloadData,
    options?: Partial<InputGenerateTransactionOptions>,
  ) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    let response

    try {
      response = await provider.signAndSubmit(convertTransactionPayloadToOldFormat(payload) as any, options)
    } catch (error) {
      if ((error as any)?.code === 1002) {
        throw new UserRejectedRequestError(error)
      }
    }
    if (!response || !response.success) {
      // TODO: unify WalletProviderError
      throw new Error('sign and submit failed')
    }
    return response.result
  }

  async signTransaction(payload: InputGenerateTransactionPayloadData) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signTransaction(convertTransactionPayloadToOldFormat(payload) as any)
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const response = await provider.signMessage(message)

    if (!response || response.success) {
      throw new Error('signMessage failed')
    }

    return response.result
  }

  protected onAccountsChanged = async (address: Address) => {
    if (!address) {
      this.emit('disconnect')
    } else {
      this.emit('change', {
        account: {
          address,
          publicKey: await (await this.getProvider())?.publicKey(),
        },
      })
    }
  }

  protected onNetworkChanged = (network: NetworkInfo) => {
    const chain = this.chains.find((c) => c.id === parseInt(network.chainId, 10))
    if (chain) {
      this.emit('change', {
        network: chain.network,
      })
    }
  }
}
