import type { MSafeWallet } from '@msafe/aptos-wallet'
import { HexString, Types } from 'aptos'
import {
  ChainNotConfiguredError,
  ConnectorNotFoundError,
  ConnectorUnauthorizedError,
  UserRejectedRequestError,
} from '../errors'
import { Address } from '../types'
import { Connector, ConnectorData, ConnectorTransactionResponse } from './base'
import { Account, SignMessagePayload, SignMessageResponse } from './types'
import { Chain } from '../chain'

declare const MSafeOrigins: {
  mainnet: string
  testnet: string
  partner: string
}

type NetworkType = keyof typeof MSafeOrigins | string
type MSafeNetwork = NetworkType | string
type MSafeNetworks = MSafeNetwork | MSafeNetwork[]

type MSafeWalletOptions = {
  origins?: MSafeNetworks
}

export class MsafeConnector extends Connector<MSafeWallet, MSafeWalletOptions> {
  readonly id = 'msafe'
  readonly name = 'MSafe'

  provider?: MSafeWallet

  ready =
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof window?.parent !== 'undefined' &&
    window?.parent.window !== window

  constructor(config: { chains?: Chain[]; options?: MSafeWalletOptions } = {}) {
    super(config)
  }

  async getProvider() {
    if (!this.provider) {
      const { MSafeWallet } = await import('@msafe/aptos-wallet')
      // @ts-ignore
      this.provider = MSafeWallet.new(this.options?.origins)

      if (!this.provider) throw new ConnectorNotFoundError()
      return this.provider
    }

    return this.provider
  }

  async connect(): Promise<Required<ConnectorData<any>>> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    this.emit('message', { type: 'connecting' })

    const account = await provider.connect()
    const network = await provider.network()
    if (!account || !account.address) throw new ConnectorUnauthorizedError()

    provider.onChangeAccount((account_) => {
      this.emit('change', {
        account: account_ as Account,
      })
    })

    provider.onChangeNetwork((network_) => {
      this.emit('change', {
        network: network_.toLowerCase(),
      })
    })

    return {
      account: {
        address: account.address as Address,
      },
      network: network.toLowerCase() ?? 'mainnet',
      provider,
    }
  }

  async network(): Promise<string> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const networkName = await provider.network()
    if (!networkName) throw new ChainNotConfiguredError()
    return networkName.toLowerCase()
  }

  async account(): Promise<Account> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const account = await provider.account()
    if (!account) throw new ConnectorUnauthorizedError()
    return {
      address: account.address as Address,
      publicKey: account.publicKey ?? undefined,
    }
  }

  async signAndSubmitTransaction(transaction?: Types.TransactionPayload): Promise<ConnectorTransactionResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    try {
      const response = await provider.signAndSubmit(transaction as any)
      return { hash: HexString.fromUint8Array(response).hex() }
    } catch (error) {
      // TODO: what's the reject error code?
      if ((error as any)?.message === 'User declined to send the transaction') {
        throw new UserRejectedRequestError(error)
      } else {
        throw error
      }
    }
  }

  async signTransaction(_transaction?: Types.TransactionPayload): Promise<Uint8Array> {
    throw new Error('Method not implemented.')
  }

  async signMessage(_message: SignMessagePayload): Promise<SignMessageResponse> {
    throw new Error('Method not implemented.')
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
