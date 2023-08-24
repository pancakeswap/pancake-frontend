import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NotifyClient, NotifyClientTypes } from '@walletconnect/notify-client'
import { EventEmitter } from 'events'
import type { PushFacadeEvents } from './listenerTypes'
import { ObservablesController } from './observablesController'
import ExternalPushProvider from './pushProviders/externalPushProvider'
import InternalPushProvider from './pushProviders/internalPushProvider'
import type { W3iPush } from './pushProviders/types'

class W3iPushFacade implements W3iPush {
  private readonly providerMap = {
    internal: InternalPushProvider,
    external: ExternalPushProvider,
    android: ExternalPushProvider,
    reactnative: ExternalPushProvider,
    ios: ExternalPushProvider
  }
  private readonly providerName: keyof typeof this.providerMap
  private readonly emitter: EventEmitter
  private readonly observablesController: ObservablesController<PushFacadeEvents>
  private readonly provider: ExternalPushProvider | InternalPushProvider

  public constructor(providerName: W3iPushFacade['providerName']) {
    this.providerName = providerName
    this.emitter = new EventEmitter()
    this.observablesController = new ObservablesController(this.emitter)

    const ProviderClass = this.providerMap[this.providerName]
    this.provider = new ProviderClass(this.emitter, providerName)
  }

  public initInternalProvider(pushClient: NotifyClient) {
    const internalProvider = this.provider as InternalPushProvider
    internalProvider.initState(pushClient)
  }

  // Method to be used by external providers. Not internal use.
  public postMessage(messageData: JsonRpcRequest<unknown>) {
    console.log('heyyyyyyyyy')
    this.emitter.emit(messageData.id.toString(), messageData)
    if (this.provider.isListeningToMethodFromPostMessage(messageData.method)) {
      this.provider.handleMessage(messageData)
    }
  }

  public get observe() {
    return this.observablesController.observe
  }

  public get observeOne() {
    return this.observablesController.observeOne
  }

  // ------------------ Push Client Forwarding ------------------

  public async register(params: { account: string }) {
    return this.provider.register(params)
  }

  public async subscribe(params: { metadata: NotifyClientTypes.Metadata; account: string }) {
    return this.provider.subscribe(params)
  }

  public async update(params: { topic: string; scope: string[] }) {
    return this.provider.update(params)
  }

  public async deleteSubscription(params: { topic: string }) {
    return this.provider.deleteSubscription(params).then(() => {
      this.emitter.emit('notify_delete', {})
    })
  }

  public async getActiveSubscriptions(params?: { account: string }) {
    return this.provider.getActiveSubscriptions(params)
  }

  public async getMessageHistory(params: { topic: string }) {
    return this.provider.getMessageHistory(params)
  }

  public async deleteNotifyMessage(params: { id: number }) {
    return this.provider.deleteNotifyMessage(params)
  }
}

export default W3iPushFacade
