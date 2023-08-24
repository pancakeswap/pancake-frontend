import { EventEmitter } from 'events'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import ExternalAuthProvider from './authProviders/externalAuthProvider'
import InternalAuthProvider from './authProviders/internalAuthProvider'
import type { AuthFacadeEvents } from './authProviders/types'
import { ObservablesController } from './observablesController'

class W3iAuthFacade {
  private readonly providerMap = {
    internal: InternalAuthProvider,
    external: ExternalAuthProvider,
    ios: ExternalAuthProvider,
    reactnative: ExternalAuthProvider,
    android: ExternalAuthProvider
  }
  private readonly providerName: keyof typeof this.providerMap
  private readonly emitter: EventEmitter
  private readonly observablesController: ObservablesController<AuthFacadeEvents>
  private readonly provider: ExternalAuthProvider | InternalAuthProvider

  public constructor(providerName: W3iAuthFacade['providerName']) {
    this.providerName = providerName
    this.emitter = new EventEmitter()
    this.observablesController = new ObservablesController(this.emitter)
    const ProviderClass = this.providerMap[this.providerName]
    this.provider = new ProviderClass(this.emitter, providerName)
  }

  // Method to be used by external providers. Not internal use.
  public postMessage(messageData: JsonRpcRequest<unknown>) {
    this.emitter.emit(messageData.id.toString(), messageData)
    switch (messageData.method) {
      default:
        if (this.provider.isListeningToMethodFromPostMessage(messageData.method)) {
          this.provider.handleMessage(messageData)
        }
    }
  }

  public async initInternalProvider() {
    const internalProvider = this.provider as InternalAuthProvider
    await internalProvider.initState()
  }

  public getAccount() {
    return this.provider.getAccount()
  }

  public setAccount(account: string) {
    this.provider.setAccount(account)

    this.emitter.emit('auth_set_account', { account })
  }

  public get observe() {
    return this.observablesController.observe
  }

  public get observeOne() {
    return this.observablesController.observeOne
  }
}

export default W3iAuthFacade
