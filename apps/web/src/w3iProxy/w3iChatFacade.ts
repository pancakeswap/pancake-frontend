import { EventEmitter } from 'events'
import type ChatClient from '@walletconnect/chat-client'
// eslint-disable-next-line no-duplicate-imports
import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { ChatFacadeEvents } from './listenerTypes'
import type { W3iChat } from './chatProviders/types'
import InternalChatProvider from './chatProviders/internalChatProvider'
import ExternalChatProvider from './chatProviders/externalChatProvider'
import { filter, from, ReplaySubject, scan, throwError, timeout } from 'rxjs'
import { ONE_DAY } from '@walletconnect/time'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import { hashMessage } from 'viem'
import { ObservablesController } from './observablesController'

export type ReplayMessage = ChatClientTypes.Message & {
  id: string
  originalTimestamp: number
  status: 'failed' | 'pending' | 'sent'
  count: number
}

export const getMessageId = (params: ChatClientTypes.Message) => {
  return hashMessage(`${params.message}${params.timestamp}${params.authorAccount}`)
}

class W3iChatFacade implements W3iChat {
  private readonly providerMap = {
    internal: InternalChatProvider,
    external: ExternalChatProvider,
    ios: ExternalChatProvider,
    reactnative: ExternalChatProvider,
    android: ExternalChatProvider
  }
  private readonly providerName: keyof typeof this.providerMap
  private readonly messageReplaySubject: ReplaySubject<ReplayMessage>
  private readonly messageReplayMaxCount = 3

  private readonly emitter: EventEmitter
  private readonly observablesController: ObservablesController<ChatFacadeEvents>
  private readonly provider: ExternalChatProvider | InternalChatProvider
  private readonly messageSendTimeout = 1000

  private unsentMessages: ReplayMessage[] = []

  public constructor(providerName: W3iChatFacade['providerName']) {
    this.providerName = providerName
    this.emitter = new EventEmitter()
    this.observablesController = new ObservablesController(this.emitter)

    const ProviderClass = this.providerMap[this.providerName]
    this.provider = new ProviderClass(this.emitter, providerName)

    // Discuss expiry of messages
    this.messageReplaySubject = new ReplaySubject(undefined, ONE_DAY / 2)
    this.messageSendTimeout = 1000
    this.handleMessagePublishing()
    this.subscribeToUnsentMessages()
  }

  private handleMessagePublishing() {
    this.messageReplaySubject.pipe(filter(m => m.status === 'pending')).subscribe(replayMessage => {
      from(this.provider.message(replayMessage))
        .pipe(
          timeout({
            each: this.messageSendTimeout + replayMessage.count * this.messageSendTimeout,
            with: info => throwError(() => new Error(JSON.stringify(info)))
          })
        )
        .subscribe({
          next: () => {
            this.emitter.emit('chat_message_sent')
            this.messageReplaySubject.next({
              ...replayMessage,
              status: 'sent'
            })
            this.emitter.emit('chat_message_attempt')
          },
          error: () => {
            if (replayMessage.count > this.messageReplayMaxCount) {
              this.messageReplaySubject.next({
                ...replayMessage,
                status: 'failed',
                count: replayMessage.count + 1
              })
              this.emitter.emit('chat_message_attempt')
            } else {
              const timeoutTime = replayMessage.count * this.messageSendTimeout
              setTimeout(() => {
                this.messageReplaySubject.next({
                  ...replayMessage,
                  count: replayMessage.count + 1
                })
                this.emitter.emit('chat_message_attempt')
              }, timeoutTime)
            }
          }
        })
    })
  }

  private subscribeToUnsentMessages() {
    this.messageReplaySubject
      .pipe(
        scan<ReplayMessage, Map<string, ReplayMessage>>((messageMap, message) => {
          const isNewMessage = !messageMap.has(message.id)
          const isNewerMessage =
            messageMap.has(message.id) && messageMap.get(message.id)?.status !== message.status

          if (isNewMessage || isNewerMessage) {
            messageMap.set(message.id, message)
          }

          return messageMap
        }, new Map())
      )
      .subscribe({
        next: messageMap => {
          const messages: ReplayMessage[] = []
          for (const message of messageMap.values()) {
            if (message.status !== 'sent') {
              messages.push(message)
            }
          }
          this.unsentMessages = messages
        }
      })
  }

  /*
   * Messages that are not in the chat client due to them not being
   * successfully sent.
   */
  public getUnsentMessages() {
    return this.unsentMessages
  }

  public retryMessage(params: ChatClientTypes.Message) {
    const replayMessage: ReplayMessage = {
      ...params,
      originalTimestamp: Date.now(),
      timestamp: Date.now(),
      id: getMessageId(params),
      status: 'pending',
      count: 0
    }

    this.messageReplaySubject.next(replayMessage)
    this.emitter.emit('chat_message_attempt')
  }

  public async initInternalProvider(chatClient: ChatClient) {
    const internalProvider = this.provider as InternalChatProvider
    await internalProvider.initState(chatClient)
  }

  // Method to be used by external providers. Not internal use.
  public postMessage(messageData: JsonRpcRequest<unknown>) {
    this.emitter.emit(messageData.id.toString(), messageData)
    if (this.provider.isListeningToMethodFromPostMessage(messageData.method)) {
      this.provider.handleMessage(messageData)
    }
  }

  public async leave(params: { topic: string }) {
    return this.provider.leave(params)
  }

  public async reject(params: { id: number }) {
    return this.provider.reject(params)
  }

  public async accept(params: { id: number }) {
    return this.provider.accept(params)
  }

  public async unregister(params: { account: string }) {
    return this.provider.unregister(params)
  }

  public async goPrivate(params: { account: string }) {
    return this.provider.goPrivate(params)
  }

  public async goPublic(params: { account: string }) {
    return this.provider.goPublic(params)
  }

  public async getThreads(params?: { account: string }) {
    return this.provider.getThreads(params)
  }

  public async getSentInvites(params?: { account: string }) {
    const account = params?.account ?? window.web3inbox.auth.getAccount()
    if (!account) {
      throw new Error(
        "An account param must be provided, or an account must've been set for getSentInvites"
      )
    }

    return this.provider.getSentInvites({ account })
  }

  public async getReceivedInvites(params?: { account: string }) {
    const account = params?.account ?? window.web3inbox.auth.getAccount()
    if (!account) {
      throw new Error(
        "An account param must be provided, or an account must've been set for getReceivedInvites"
      )
    }

    return this.provider.getReceivedInvites({ account })
  }

  public async invite(params: ChatClientTypes.Invite) {
    return this.provider.invite(params).then(inviteId => {
      this.emitter.emit('chat_invite_sent', {
        ...params
      })

      return inviteId
    })
  }
  public async ping(params: { topic: string }) {
    return this.provider.ping(params)
  }
  public async message(params: ChatClientTypes.Message) {
    const replayMessage: ReplayMessage = {
      ...params,
      originalTimestamp: params.timestamp,
      id: getMessageId(params),
      status: 'pending',
      count: 0
    }

    this.messageReplaySubject.next(replayMessage)
    this.emitter.emit('chat_message_attempt')

    return Promise.resolve()
  }

  public async register(params: { account: string; private?: boolean | undefined }) {
    return this.provider.register(params)
  }

  public async resolve(params: { account: string }) {
    return this.provider.resolve(params)
  }

  public async getMessages(params: { topic: string }) {
    return this.provider.getMessages(params)
  }

  public async muteContact({ topic }: { topic: string }) {
    return this.provider.muteContact({ topic })
  }

  public async unmuteContact({ topic }: { topic: string }) {
    return this.provider.unmuteContact({ topic })
  }

  public async getMutedContacts() {
    return this.provider.getMutedContacts()
  }

  public get observe() {
    return this.observablesController.observe
  }
  public get observeOne() {
    return this.observablesController.observeOne
  }
}

export default W3iChatFacade
