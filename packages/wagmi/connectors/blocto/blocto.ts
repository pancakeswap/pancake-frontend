/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import {
  ProviderRpcError,
  ResourceNotFoundRpcError,
  UserRejectedRequestError,
  createWalletClient,
  custom,
  getAddress,
} from 'viem'
import { Connector, Chain, WalletClient, ConnectorNotFoundError, ChainNotConfiguredError } from '@wagmi/core'
import type { EthereumProviderInterface } from '@blocto/sdk'
import { normalizeChainId } from '../utils'

const chainIdToNetwork: { [network: number]: string } = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
  56: 'bsc', // BSC Mainnet
  97: 'chapel', // BSC Testnet
  137: 'polygon', // Polygon Mainnet
  80001: 'mumbai', // Polygon Testnet
  43114: 'avalanche', // Avalanche Mainnet
  43113: 'fuji', // Avalanche Testnet
}

export class BloctoConnector extends Connector<EthereumProviderInterface, { defaultChainId: number; appId?: string }> {
  readonly id = 'blocto'

  readonly name = 'Blocto'

  readonly ready = typeof window !== 'undefined'

  #provider?: EthereumProviderInterface

  constructor(
    config: { chains?: Chain[]; options: { defaultChainId: number; appId?: string } } = {
      options: { defaultChainId: 56 },
    },
  ) {
    const chains = config.chains?.filter((c) => !!chainIdToNetwork[c.id])
    super({
      chains,
      options: config.options,
    })
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider({ chainId })
      if (!provider) throw new ConnectorNotFoundError()

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect)
      }

      this.emit('message', { type: 'connecting' })

      const account = await this.getAccount()
      const id = await this.getChainId()
      const unsupported = this.isChainUnsupported(id)

      return { account, chain: { id, unsupported }, provider }
    } catch (error) {
      this.disconnect()
      if (this.isUserRejectedRequestError(error)) throw new UserRejectedRequestError(error as Error)
      if ((<ProviderRpcError>error).code === -32002) throw new ResourceNotFoundRpcError(error as ProviderRpcError)
      throw error
    }
  }

  async getProvider({ chainId }: { chainId?: number } = {}) {
    // Force create new provider
    if (!this.#provider || chainId) {
      const rpc = this.chains.reduce(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        (rpc, chain) => ({ ...rpc, [chain.id]: chain.rpcUrls.default.http[0] }),
        {} as Record<number, string>,
      )

      let targetChainId = chainId
      if (!targetChainId) {
        const fallbackChainId = this.options.defaultChainId
        if (fallbackChainId && !this.isChainUnsupported(fallbackChainId)) targetChainId = fallbackChainId
      }

      if (!targetChainId) throw new ChainNotConfiguredError({ chainId: targetChainId || 0, connectorId: this.id })

      const BloctoSDK = (await import('@blocto/sdk')).default
      this.#provider = new BloctoSDK({
        appId: this.options.appId,
        ethereum: {
          chainId: targetChainId,
          rpc: rpc[targetChainId],
        },
      }).ethereum
    }

    if (!this.#provider) throw new ConnectorNotFoundError()

    return this.#provider
  }

  async isAuthorized(): Promise<boolean> {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      const accounts = provider.accounts
      const account = accounts[0]
      return !!account
    } catch {
      return false
    }
  }

  async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
    const [provider, account] = await Promise.all([this.getProvider({ chainId }), this.getAccount()])
    const chain = this.chains.find((x) => x.id === chainId) || this.chains[0]
    if (!provider) throw new Error('provider is required.')
    return createWalletClient({
      account,
      chain,
      transport: custom(provider),
    })
  }

  async getAccount() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    })
    let account = accounts[0]
    if (typeof account === 'string' && !account.startsWith('0x')) {
      account = `0x${account}`
    }
    // return checksum address
    return getAddress(account)
  }

  async getChainId() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.request({ method: 'eth_chainId' }).then(normalizeChainId)
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect')
    else {
      let account = accounts[0]
      if (typeof account === 'string' && !account.startsWith('0x')) {
        account = `0x${account}`
      }
      this.emit('change', {
        account: getAddress(account),
      })
    }
  }

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit('change', { chain: { id, unsupported } })
  }

  protected onDisconnect = () => {
    this.emit('disconnect')
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider?.removeListener) return

    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)
  }

  protected isUserRejectedRequestError(error: unknown) {
    return (error as ProviderRpcError).code === 4001
  }
}
