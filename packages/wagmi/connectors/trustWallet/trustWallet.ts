/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { Chain, ConnectorNotFoundError, WindowProvider } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { Address, getConfig } from '@wagmi/core'
import '@wagmi/core/window'
import { getAddress, ResourceUnavailableRpcError, ProviderRpcError, UserRejectedRequestError } from 'viem'

declare global {
  interface Window {
    trustwallet?: WindowProvider
  }
}

export function getTrustWalletProvider(): WindowProvider | undefined {
  const isTrustWallet = (ethereum: NonNullable<Window['ethereum']>) => {
    // Identify if Trust Wallet injected provider is present.
    const trustWallet = !!ethereum.isTrust

    return trustWallet
  }

  const injectedProviderExist = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'

  // No injected providers exist.
  if (!injectedProviderExist) {
    return
  }

  // Trust Wallet was injected into window.ethereum.
  if (isTrustWallet(window.ethereum as NonNullable<Window['ethereum']>)) {
    return window.ethereum
  }

  // Trust Wallet provider might be replaced by another
  // injected provider, check the providers array.
  if (window.ethereum?.providers) {
    return window.ethereum.providers.find(isTrustWallet)
  }

  // In some cases injected providers can replace window.ethereum
  // without updating the providers array. In those instances the Trust Wallet
  // can be installed and its provider instance can be retrieved by
  // looking at the global `trustwallet` object.
  return window.trustwallet
}

export class TrustWalletConnector extends InjectedConnector {
  readonly id = 'trustWallet'

  constructor({
    chains,
    options: _options,
  }: {
    chains?: Chain[]
    options?: {
      shimDisconnect?: boolean
      shimChainChangedDisconnect?: boolean
    }
  } = {}) {
    const options = {
      name: 'Trust Wallet',
      shimDisconnect: _options?.shimDisconnect ?? false,
      shimChainChangedDisconnect: _options?.shimChainChangedDisconnect ?? true,
    }

    super({
      chains,
      options,
    })
  }

  private handleFailedConnect(error: Error): never {
    if (this.isUserRejectedRequestError(error)) {
      throw new UserRejectedRequestError(error)
    }

    if ((error as ProviderRpcError).code === -32002) {
      throw new ResourceUnavailableRpcError(error)
    }

    throw error
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider()
      if (!provider) {
        throw new ConnectorNotFoundError()
      }

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect)
      }

      this.emit('message', { type: 'connecting' })

      // Attempt to show wallet select prompt with `wallet_requestPermissions` when
      // `shimDisconnect` is active and account is in disconnected state (flag in storage)
      let account: Address | null = null
      if (this.options?.shimDisconnect && !getConfig().storage?.getItem(this.shimDisconnectKey)) {
        account = await this.getAccount().catch(() => null)
        const isConnected = !!account
        if (isConnected) {
          // Attempt to show another prompt for selecting wallet if already connected
          try {
            await provider.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }],
            })
            // User may have selected a different account so we will need to revalidate here.
            account = await this.getAccount()
          } catch (error) {
            // Only bubble up error if user rejects request
            if (this.isUserRejectedRequestError(error)) {
              throw new UserRejectedRequestError(error as Error)
            }
          }
        }
      }

      if (!account) {
        const accounts = await provider.request({
          method: 'eth_requestAccounts',
        })
        account = getAddress(accounts[0] as Address)
      }

      // Switch to chain if provided
      let id = await this.getChainId()
      let unsupported = this.isChainUnsupported(id)
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId)
        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }

      if (this.options?.shimDisconnect) {
        getConfig().storage?.setItem(this.shimDisconnectKey, true)
      }

      return { account, chain: { id, unsupported }, provider }
    } catch (error) {
      this.handleFailedConnect(error as Error)
    }
  }

  async getProvider() {
    return getTrustWalletProvider()
  }
}
