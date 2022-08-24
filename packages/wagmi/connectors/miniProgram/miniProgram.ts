/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { getAddress } from '@ethersproject/address'
import { Chain, ConnectorNotFoundError, ResourceUnavailableError, RpcError, UserRejectedRequestError } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

declare global {
  interface Window {
    bn?: any
  }
}

export class MiniProgramConnector extends InjectedConnector {
  readonly id = 'miniprogram'

  readonly ready = typeof window !== 'undefined' && !!window.bn

  provider?: any

  getWeb3Provider?: any

  constructor({ chains, getWeb3Provider }: { getWeb3Provider: () => any; chains?: Chain[] }) {
    const options = {
      name: 'BnInjected',
      shimDisconnect: false,
      shimChainChangedDisconnect: false,
    }
    super({
      chains,
      options,
    })

    this.getWeb3Provider = getWeb3Provider
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

  async getAccount() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const accounts = await provider.request({
      method: 'eth_accounts',
    })
    // return checksum address
    return getAddress(<string>accounts[0])
  }

  async getProvider() {
    if (typeof window !== 'undefined') {
      // TODO: Fallback to `ethereum#initialized` event for async injection
      // https://github.com/MetaMask/detect-provider#synchronous-and-asynchronous-injection=
      this.provider = this.getWeb3Provider()
    }
    return this.provider
  }
}
