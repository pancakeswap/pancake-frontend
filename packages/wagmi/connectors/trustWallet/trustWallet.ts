/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { type EthereumProvider } from '@walletconnect/ethereum-provider'
import { getAddress } from 'viem'
import { createConnector, normalizeChainId } from 'wagmi'

declare global {
  interface Window {
    trustwallet?: any
    ethereum?: any
  }
}

export function getTrustWalletProvider(): any | undefined {
  const isTrustWallet = (ethereum: NonNullable<Window['ethereum']>) => {
    // Identify if Trust Wallet injected provider is present.
    const trustWallet = !!ethereum.isTrust

    return trustWallet
  }

  const injectedProviderExist =
    typeof window !== 'undefined' &&
    window !== null &&
    typeof window.ethereum !== 'undefined' &&
    window.ethereum !== null

  // No injected providers exist.
  if (!injectedProviderExist) {
    return
  }

  // Trust Wallet was injected into window.ethereum.
  if (isTrustWallet(window.ethereum as NonNullable<Window['ethereum']>)) {
    return window.ethereum
  }

  let trustWalletProvider

  if (window.ethereum?.providers?.length) {
    // Trust Wallet provider might be replaced by another
    // injected provider, check the providers array.
    trustWalletProvider = window.ethereum.providers.find((provider: any) => provider && isTrustWallet(provider))
  }

  if (!trustWalletProvider) {
    // In some cases injected providers can replace window.ethereum
    // without updating the providers array. In those instances the Trust Wallet
    // can be installed and its provider instance can be retrieved by
    // looking at the global `trustwallet` object.
    trustWalletProvider = window.trustwallet
  }

  return trustWalletProvider
}

trustWalletConnect.type = 'trustWalletConnect' as const
export function trustWalletConnect() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  type Properties = {}
  type StorageItem = {
    store: any
    'wagmi.recentConnectorId': string
  }

  type Provider = Awaited<ReturnType<(typeof EthereumProvider)['init']>>

  let walletProvider: Provider | undefined

  const handleConnectReset = () => {
    walletProvider = undefined
  }

  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: 'trustWalletConnect',
    name: 'TrustWallet',
    type: trustWalletConnect.type,
    async connect({ chainId } = {}) {
      try {
        const provider = await this.getProvider({ chainId })

        config.emitter.emit('message', { type: 'connecting' })

        await provider.request({
          method: 'eth_requestAccounts',
        })

        const accounts = await this.getAccounts()
        const _chainId = await this.getChainId()

        return { accounts, chainId: _chainId }
      } catch (error: unknown) {
        handleConnectReset()
        throw error
      }
    },
    async disconnect() {
      const provider = await this.getProvider()
      await provider.request({ method: 'wallet_disconnect' })
      handleConnectReset()
    },
    async getAccounts() {
      const provider = await this.getProvider()
      const accounts = (await provider.request({
        method: 'eth_accounts',
      })) as string[]

      return accounts.map((x) => getAddress(x))
    },
    async getChainId() {
      const provider = await this.getProvider()
      const chainId = await provider?.request({ method: 'eth_chainId' })
      return normalizeChainId(chainId)
    },
    async getProvider() {
      if (!walletProvider) {
        walletProvider = getTrustWalletProvider()
        if (!walletProvider) {
          throw new Error('Blocto SDK is not initialized.')
        }

        walletProvider.on('accountsChanged', this.onAccountsChanged.bind(this))
        walletProvider.on('chainChanged', this.onChainChanged.bind(this))
        walletProvider.on('disconnect', this.onDisconnect.bind(this))
      }

      return Promise.resolve(walletProvider)
    },
    async isAuthorized() {
      const recentConnectorId = await config.storage?.getItem('recentConnectorId')
      if (recentConnectorId !== this.id) return false

      const accounts = await this.getAccounts()
      return !!accounts.length
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAccountsChanged() {},
    async onChainChanged(chainId: string) {
      const accounts = await this.getAccounts()
      config.emitter.emit('change', {
        chainId: normalizeChainId(chainId),
        accounts,
      })
    },
    async onDisconnect() {
      config.emitter.emit('disconnect')
    },
  }))
}
