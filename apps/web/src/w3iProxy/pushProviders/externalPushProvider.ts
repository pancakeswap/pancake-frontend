import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NotifyClientTypes } from '@walletconnect/notify-client'
import type { EventEmitter } from 'events'
import { AndroidCommunicator } from '../externalCommunicators/androidCommunicator'
import type { ExternalCommunicator } from '../externalCommunicators/communicatorType'
import { IOSCommunicator } from '../externalCommunicators/iosCommunicator'
import { JsCommunicator } from '../externalCommunicators/jsCommunicator'
import { ReactNativeCommunicator } from '../externalCommunicators/reactNativeCommunicator'
import type { PushClientFunctions, W3iPushProvider } from './types'

export default class ExternalPushProvider implements W3iPushProvider {
  protected readonly emitter: EventEmitter
  private readonly methodsListenedTo = [
    'notify_subscription',
    'notify_message',
    'notify_update',
    'notify_delete',
    'sync_update'
  ]
  public providerName = 'ExternalPushProvider'
  protected readonly communicator: ExternalCommunicator

  /*
   * We have no need to register events here like we do in internal provider
   * because the events come through the emitter anyway.
   */
  public constructor(emitter: EventEmitter, name: string) {
    this.emitter = emitter
    switch (name) {
      case 'android':
        this.communicator = new AndroidCommunicator(this.emitter)
        break
      case 'ios':
        this.communicator = new IOSCommunicator(this.emitter)
        break
      case 'reactnative':
        this.communicator = new ReactNativeCommunicator(this.emitter, 'notify')
        break
      default:
        this.communicator = new JsCommunicator(this.emitter)
        break
    }
  }

  protected async postToExternalProvider<MName extends keyof PushClientFunctions>(
    methodName: MName,
    ...params: Parameters<PushClientFunctions[MName]>
  ) {
    return this.communicator.postToExternalProvider<ReturnType<PushClientFunctions[MName]>>(
      methodName,
      params[0],
      'notify'
    )
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    console.log({ request })
    switch (request.method) {
      case 'notify_subscription':
      case 'notify_message':
      case 'notify_update':
      case 'notify_delete':
      case 'sync_update':
        this.emitter.emit(request.method, request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
  }

  public async register(params: { account: string }) {
    console.log('registerrrrinnnnnngggggggggg')
    return this.postToExternalProvider('register', {
      account: params.account,
      // Signing will be handled wallet-side.
      onSign: async () => Promise.resolve('')
    })
  }

  public async subscribe(params: { metadata: NotifyClientTypes.Metadata; account: string }) {
    return this.postToExternalProvider('subscribe', {
      ...params
    })
  }

  public async update(params: { topic: string; scope: string[] }) {
    return this.postToExternalProvider('update', params)
  }

  public async deleteSubscription(params: { topic: string }) {
    return this.postToExternalProvider('deleteSubscription', params)
  }

  public async getActiveSubscriptions(params?: { account: string }) {
    return this.postToExternalProvider('getActiveSubscriptions', params)
  }

  public async getMessageHistory(params: { topic: string }) {
    return this.postToExternalProvider('getMessageHistory', params)
  }

  public async deleteNotifyMessage(params: { id: number }) {
    return this.postToExternalProvider('deleteNotifyMessage', params)
  }
}
