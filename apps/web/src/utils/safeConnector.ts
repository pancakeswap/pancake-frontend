/* eslint-disable lines-between-class-members */

// Forked from @gnosis.pm/safe-apps-wagmi for esm
import { Web3Provider } from '@ethersproject/providers'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import SafeAppsSDK, { Opts as SafeOpts, SafeInfo } from '@gnosis.pm/safe-apps-sdk'
import { getAddress } from 'ethers/lib/utils'
import { Connector, Chain, ConnectorNotFoundError } from '@wagmi/core'

function normalizeChainId(chainId: string | number) {
  if (typeof chainId === 'string') {
    const isHex = chainId.trim().substring(0, 2)

    return Number.parseInt(chainId, isHex === '0x' ? 16 : 10)
  }
  return chainId
}

const __IS_SERVER__ = typeof window === 'undefined'
const __IS_IFRAME__ = !__IS_SERVER__ && window?.parent !== window

class SafeConnector extends Connector<SafeAppProvider, SafeOpts | undefined> {
  readonly id = 'safe'
  readonly name = 'Safe'
  ready = !__IS_SERVER__ && __IS_IFRAME__

  provider?: SafeAppProvider
  sdk: SafeAppsSDK
  safe?: SafeInfo

  constructor(config: { chains?: Chain[]; options?: SafeOpts }) {
    super({ ...config, options: config?.options })

    this.sdk = new SafeAppsSDK(config.options)
  }

  async connect() {
    const runningAsSafeApp = await this.isSafeApp()
    if (!runningAsSafeApp) {
      throw new ConnectorNotFoundError()
    }

    const provider = await this.getProvider()
    if (provider.on) {
      provider.on('accountsChanged', this.onAccountsChanged)
      provider.on('chainChanged', this.onChainChanged)
      provider.on('disconnect', this.onDisconnect)
    }

    const account = await this.getAccount()
    const id = await this.getChainId()

    return {
      account,
      provider,
      chain: { id, unsupported: this.isChainUnsupported(id) },
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider?.removeListener) return

    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)
  }

  async getAccount() {
    if (!this.safe) {
      throw new ConnectorNotFoundError()
    }

    return getAddress(this.safe.safeAddress)
  }

  async getChainId() {
    if (!this.provider) {
      throw new ConnectorNotFoundError()
    }

    return normalizeChainId(this.provider.chainId)
  }

  async getSafeInfo(): Promise<SafeInfo> {
    if (!this.sdk) {
      throw new ConnectorNotFoundError()
    }
    if (!this.safe) {
      this.safe = await this.sdk.safe.getInfo()
    }
    return this.safe
  }

  async isSafeApp(): Promise<boolean> {
    if (!this.ready) {
      return false
    }

    const safe = await Promise.race([this.getSafeInfo(), new Promise<void>((resolve) => setTimeout(resolve, 300))])
    return !!safe
  }

  async getProvider() {
    if (!this.provider) {
      const safe = await this.getSafeInfo()
      if (!safe) {
        throw new Error('Could not load Safe information')
      }

      this.provider = new SafeAppProvider(safe, this.sdk)
    }
    return this.provider
  }

  async getSigner() {
    const provider = await this.getProvider()
    const account = await this.getAccount()
    return new Web3Provider(provider).getSigner(account)
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
  }

  protected onAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) this.emit('disconnect')
    else this.emit('change', { account: getAddress(accounts[0]) })
  }

  protected isChainUnsupported(chainId: number) {
    return !this.chains.some((x) => x.id === chainId)
  }

  protected onChainChanged(chainId: string | number) {
    const id = normalizeChainId(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit('change', { chain: { id, unsupported } })
  }

  protected onDisconnect() {
    this.emit('disconnect')
  }
}

export { SafeConnector }
