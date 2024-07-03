import type { AptosProviderInterface, AptosProviderConfig } from '@blocto/sdk'
import { Aptos, InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk'

import { Chain } from '../chain'
import {
  ChainNotConfiguredError,
  ConnectorNotFoundError,
  ConnectorUnauthorizedError,
  UserRejectedRequestError,
} from '../errors'
import { Address } from '../types'
import { Connector, ConnectorData, ConnectorTransactionResponse } from './base'
import { Account, SignMessagePayload, SignMessageResponse } from './types'
import { convertTransactionPayloadToOldFormat } from '../transactions/payloadTransformer'

declare global {
  interface Window {
    bloctoAptos?: AptosProviderInterface
  }
}

const networkMapping: Record<string, number> = {
  mainnet: 1,
  testnet: 2,
}

export class BloctoConnector extends Connector<AptosProviderInterface, Partial<AptosProviderConfig>> {
  readonly id = 'blocto'
  readonly name = 'Blocto'

  provider?: AptosProviderInterface

  ready = typeof window !== 'undefined' && (window as any)?.bloctoAptos

  constructor(config: { chains?: Chain[]; options?: Partial<AptosProviderConfig> } = {}) {
    super(config)
  }

  async getProvider({ networkName }: { networkName?: string } = {}) {
    if (!this.provider) {
      const BloctoSDK = (await import('@blocto/sdk')).default
      // @ts-ignore
      this.provider = new BloctoSDK({
        appId: this.options?.appId,
        aptos: {
          chainId: networkMapping[networkName?.toLowerCase() || 'mainnet'] ?? 1,
        },
      }).aptos

      if (!this.provider) throw new ConnectorNotFoundError()
      return this.provider
    }

    return this.provider
  }

  async connect({ networkName }: { networkName?: string } = {}): Promise<Required<ConnectorData<any>>> {
    const provider = await this.getProvider({ networkName })
    if (!provider) throw new ConnectorNotFoundError()

    this.emit('message', { type: 'connecting' })

    const account = await provider.connect()
    const network = await provider.network()
    if (!account || !account.address) throw new ConnectorUnauthorizedError()

    return {
      account: {
        address: account.address as Address,
      },
      network: network.name ?? networkName ?? 'mainnet',
      provider,
    }
  }

  async network(): Promise<string> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const networkName = (await provider.network()).name
    if (!networkName) throw new ChainNotConfiguredError()
    return networkName
  }

  async account(): Promise<Account> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    if (!provider.publicAccount.address) throw new ConnectorUnauthorizedError()
    return {
      address: provider.publicAccount.address as Address,
      publicKey: provider.publicAccount.publicKey ?? undefined,
    }
  }

  async signAndSubmitTransaction(
    transaction?: InputGenerateTransactionPayloadData,
  ): Promise<ConnectorTransactionResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    try {
      const response = await provider.signAndSubmitTransaction(convertTransactionPayloadToOldFormat(transaction))
      return response
    } catch (error) {
      if ((error as any)?.message === 'User declined to send the transaction') {
        throw new UserRejectedRequestError(error)
      } else {
        throw error
      }
    }
  }

  async signTransaction(
    transaction?: InputGenerateTransactionPayloadData,
  ): Promise<ReturnType<Aptos['transaction']['sign']>> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signTransaction(convertTransactionPayloadToOldFormat(transaction))
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const response = await provider.signMessage(message)

    return response
  }

  async isConnected(): Promise<boolean> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.isConnected()
  }

  async disconnect(): Promise<void> {
    const provider = await this.getProvider()
    if (!provider) return
    // eslint-disable-next-line consistent-return
    return provider.disconnect()
  }
}
