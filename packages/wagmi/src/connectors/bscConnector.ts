/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { Chain, ConnectorNotFoundError, ResourceUnavailableError, RpcError, UserRejectedRequestError } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

declare global {
  interface Window {
    BinanceChain?: {
      bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
    } & Ethereum
  }
}

export class BscConnector extends InjectedConnector {
  readonly id = 'bsc'

  readonly ready = typeof window !== 'undefined' && !!window.BinanceChain

  provider?: Window['BinanceChain']

  constructor({
    chains,
  }: {
    chains?: Chain[]
  } = {}) {
    const options = {
      name: 'Binance',
      shimDisconnect: true,
      shimChainChangedDisconnect: true,
    }
    super({
      chains,
      options,
    })
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect)
      }

      this.emit('message', { type: 'connecting' })

      const account = await this.getAccount()
      // Switch to chain if provided
      let id = await this.getChainId()
      let unsupported = this.isChainUnsupported(id)
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId)
        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }

      return { account, chain: { id, unsupported }, provider }
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) throw new UserRejectedRequestError(error)
      if ((<RpcError>error).code === -32002) throw new ResourceUnavailableError(error)
      throw error
    }
  }

  async getProvider() {
    if (typeof window !== 'undefined') {
      // TODO: Fallback to `ethereum#initialized` event for async injection
      // https://github.com/MetaMask/detect-provider#synchronous-and-asynchronous-injection=
      this.provider = window.BinanceChain
    }
    return this.provider
  }
}
