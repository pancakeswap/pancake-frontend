import type { WalletClient as PushWalletClient } from '@walletconnect/push-client'
import type { EventEmitter } from 'events'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import { DEFAULT_APP_METADATA } from 'views/Notifications/constants'
import type { PushProvider } from './types'

export default class InternalPushProvider implements PushProvider {
  public pushClient: PushWalletClient | undefined

  public emitter: EventEmitter

  private readonly methodsListenedTo = ['push_signature_delivered']

  public constructor(emitter: EventEmitter) {
    this.emitter = emitter
  }

  public initState(pushClient: PushWalletClient) {
    this.pushClient = pushClient

    this.pushClient.on('push_proposal', (args) => this.emitter.emit('push_request', args))
    this.pushClient.on('push_subscription', (args) => this.emitter.emit('push_subscription', args))
    this.pushClient.on('push_message', (args) => this.emitter.emit('push_message', args))
    this.pushClient.on('push_update', (args) => this.emitter.emit('push_update', args))
    this.pushClient.on('push_delete', (args) => this.emitter.emit('push_delete', args))

    this.pushClient.syncClient.on('sync_update', () => {
      this.emitter.emit('sync_update', {})
    })

    this.pushClient.subscriptions.core.on('sync_store_update', () => {
      this.emitter.emit('sync_update', {})
    })
  }

  public postMessage(messageData: JsonRpcRequest<unknown>) {
    this.emitter.emit(messageData.id.toString(), messageData)
    if (this.isListeningToMethodFromPostMessage(messageData.method)) {
      this.handleMessage(messageData)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private formatClientRelatedError(method: string) {
    return `An initialized PushClient is required for method: [${method}].`
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    switch (request.method) {
      case 'push_signature_delivered':
        this.emitter.emit('push_signature_delivered', request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider `)
    }
  }

  public async enablePresistantSync(params: { account: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('enablePresistantSync'))
    }
    const syncClientSignatures = this.pushClient.syncClient.signatures.getAll({
      account: params.account,
    })

    const alreadySynced = syncClientSignatures.length
    if (!alreadySynced) {
      this.emitter.emit('push_signature_requested', { message: 'dummy sig' })
      return Promise.resolve()
    }

    return this.pushClient.enableSync({
      ...params,
      onSign: async () => syncClientSignatures[syncClientSignatures.length - 1].signature,
    })
  }

  public async enableSync(params: { account: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('enableSync'))
    }
    return this.pushClient.enableSync({
      ...params,
      onSign: async (message) => {
        return window.web3inbox.signMessage(message).then((signature) => {
          return signature
        })
      },
    })
  }

  public async approve(params: { id: number }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('approve'))
    }

    return this.pushClient.approve({
      ...params,
      onSign: async (message) =>
        window.web3inbox.signMessage(message).then((signature) => {
          return signature
        }),
    })
  }

  public async reject(params: { id: number; reason: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('reject'))
    }

    return this.pushClient.reject(params)
  }

  public async subscribe(params: { account: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('subscribe'))
    }
    const subscribed = await this.pushClient.subscribe({
      account: params.account,
      metadata: DEFAULT_APP_METADATA,
      onSign: async (message) =>
        window.web3inbox.signMessage(message).then((signature) => {
          return signature
        }),
    })
    return subscribed
  }

  public async update(params: { topic: string; scope: string[] }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('update'))
    }
    const updated = await this.pushClient.update(params)
    return updated
  }

  public async deleteSubscription(params: { topic: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('deleteSubscription'))
    }
    return this.pushClient.deleteSubscription(params)
  }

  public async getActiveSubscriptions(params?: { account: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('getActiveSubscriptions'))
    }
    const subscriptions = this.pushClient.getActiveSubscriptions(params)
    return Promise.resolve(subscriptions)
  }

  public async getMessageHistory(params: { topic: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('getMessageHistory'))
    }

    const messages = this.pushClient.getMessageHistory(params)
    return Promise.resolve(messages)
  }

  public async deletePushMessage(params: { id: number }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('deletePushMessage'))
    }
    this.pushClient.deletePushMessage(params)
    return Promise.resolve()
  }
}
