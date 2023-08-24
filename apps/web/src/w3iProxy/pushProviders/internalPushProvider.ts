import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NotifyClient, NotifyClientTypes } from '@walletconnect/notify-client'
import type { EventEmitter } from 'events'
// import { getFirebaseToken } from '../../utils/firebase'
import type { W3iPushProvider } from './types'

export default class InternalPushProvider implements W3iPushProvider {
  private pushClient: NotifyClient | undefined
  private readonly emitter: EventEmitter
  public providerName = 'InternalPushProvider'
  private readonly methodsListenedTo = ['notify_signature_delivered']

  public constructor(emitter: EventEmitter, _name = 'internal') {
    this.emitter = emitter
  }

  /*
   * We need to re-register events from the chat client to the emitter
   * to allow the observers in the facade to work seamlessly.
   */
  public initState(pushClient: NotifyClient) {
    this.pushClient = pushClient

    this.pushClient.on('notify_subscription', args =>
      this.emitter.emit('notify_subscription', args)
    )
    this.pushClient.on('notify_message', args => this.emitter.emit('notify_message', args))
    this.pushClient.on('notify_update', args => this.emitter.emit('notify_update', args))
    this.pushClient.on('notify_delete', args => this.emitter.emit('notify_delete', args))

    this.pushClient.syncClient.on('sync_update', () => {
      this.emitter.emit('sync_update', {})
    })

    this.pushClient.subscriptions.core.on('sync_store_update', () => {
      this.emitter.emit('sync_update', {})
    })
  }

  // ------------------------ Provider-specific methods ------------------------

  private formatClientRelatedError(method: string) {
    return `An initialized PushClient is required for method: [${method}].`
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    switch (request.method) {
      case 'notify_signature_delivered':
        this.emitter.emit('notify_signature_delivered', request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
  }

  // ------------------- Method-forwarding for NotifyClient -------------------

  public async register(params: { account: string }) {
    // console.log('heyyyyyyyyyyyyyyy', this.pushClient)
    // if (!this.pushClient) {
    //   throw new Error(this.formatClientRelatedError('approve'))
    // }
    console.log('heyyyyyyyyyyyyyyy')

    const alreadySynced = this.pushClient.syncClient.signatures.getAll({
      account: params.account
    }).length

    console.log('is synceeeeedddddddddddd')

    let identityKey: string | undefined = undefined
    try {
      identityKey = await this.pushClient.identityKeys.getIdentity({
        account: params.account
      })
    } catch (error) {
      // Silence not found error
      console.log({ error })
    }

    if (alreadySynced && identityKey) {
      return Promise.resolve(identityKey)
    }

    return this.pushClient.register({
      ...params,
      onSign: async message => {
        this.emitter.emit('notify_signature_requested', { message })
        console.log('notifyyyyyyyy requesttteddd')

        return new Promise(resolve => {
          const intervalId = setInterval(() => {
            const signatureForAccountExists = this.pushClient?.syncClient.signatures.getAll({
              account: params.account
            })?.length
            if (this.pushClient && signatureForAccountExists) {
              const { signature: syncSignature } = this.pushClient.syncClient.signatures.get(
                params.account
              )
              this.emitter.emit('notify_signature_request_cancelled', {})
              clearInterval(intervalId)
              resolve(syncSignature)
            }
          }, 100)

          this.emitter.on(
            'notify_signature_delivered',
            ({ signature: deliveredSyncSignature }: { signature: string }) => {
              resolve(deliveredSyncSignature)
            }
          )
        })
      }
    })
  }

  public async subscribe(params: { metadata: NotifyClientTypes.Metadata; account: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('subscribe'))
    }
    console.log('InternalPushProvider > PushClient.subscribe > params', params)

    /*
     * To prevent subscribing in local/dev environemntns failing,
     * no calls to the service worker or firebase messager worker
     * will be made.
     */
    // if (window.location.protocol === 'https:' && !window.web3inbox.dappOrigin) {
    //   const clientId = await this.pushClient.core.crypto.getClientId()

    //   try {
    //     // Retrieving FCM token needs to be client side, outside the service worker.
    //     const token = await getFirebaseToken()

    //     const subEvListener = (
    //       subEv: NotifyClientTypes.BaseEventArgs<NotifyClientTypes.NotifyResponseEventArgs>
    //     ) => {
    //       if (subEv.params.subscription?.metadata.url === params.metadata.url) {
    //         navigator.serviceWorker.ready.then(registration => {
    //           registration.active?.postMessage({
    //             type: 'INSTALL_SYMKEY_CLIENT',
    //             clientId,
    //             topic: subEv.topic,
    //             token,
    //             symkey: subEv.params.subscription?.symKey
    //           })
    //         })

    //         this.pushClient?.off('notify_subscription', subEvListener)
    //       }
    //     }

    //     this.pushClient.on('notify_subscription', subEvListener)
    //   } catch (e) {
    //     console.error('Failed to use firebase messaging service', e)
    //   }
    // }

    const subscribed = await this.pushClient.subscribe({
      ...params
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

    console.log(
      'InternalPushProvider > PushClient.getActiveSubscriptions > subscriptions',
      subscriptions
    )

    return Promise.resolve(this.pushClient.getActiveSubscriptions())
  }

  public async getMessageHistory(params: { topic: string }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('getMessageHistory'))
    }

    const messages = this.pushClient.getMessageHistory(params)

    console.log('InternalPushProvider > PushClient.getMessageHistory > messages', messages)

    return Promise.resolve(messages)
  }

  public async deleteNotifyMessage(params: { id: number }) {
    if (!this.pushClient) {
      throw new Error(this.formatClientRelatedError('deleteNotifyMessage'))
    }

    this.pushClient.deleteNotifyMessage(params)

    return Promise.resolve()
  }
}
