import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { EventEmitter } from 'events'
import { AndroidCommunicator } from '../externalCommunicators/androidCommunicator'
import type { ExternalCommunicator } from '../externalCommunicators/communicatorType'
import { IOSCommunicator } from '../externalCommunicators/iosCommunicator'
import { JsCommunicator } from '../externalCommunicators/jsCommunicator'
import { ReactNativeCommunicator } from '../externalCommunicators/reactNativeCommunicator'
import type { ChatClientFunctions, W3iChatProvider } from './types'

export default class ExternalChatProvider implements W3iChatProvider {
  protected readonly emitter: EventEmitter
  protected readonly communicator: ExternalCommunicator
  private readonly methodsListenedTo = [
    'chat_message',
    'chat_invite',
    'chat_invite_accepted',
    'chat_invite_rejected',
    'chat_left',
    'chat_ping',
    'sync_update'
  ]
  public providerName = 'ExternalChatProvider'

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
        this.communicator = new ReactNativeCommunicator(this.emitter, 'chat')
        break
      default:
        this.communicator = new JsCommunicator(this.emitter)
        break
    }
  }

  protected async postToExternalProvider<MName extends keyof ChatClientFunctions>(
    methodName: MName,
    ...params: Parameters<ChatClientFunctions[MName]>
  ) {
    return this.communicator.postToExternalProvider<ReturnType<ChatClientFunctions[MName]>>(
      methodName,
      params[0],
      'chat'
    )
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    switch (request.method) {
      case 'chat_message':
      case 'chat_ping':
      case 'chat_invite_rejected':
      case 'chat_invite_accepted':
      case 'chat_invite':
      case 'chat_left':
        this.emitter.emit(request.method, request.params)
        break
      case 'chat_set_account':
        throw new Error('Setting an account externally is not supported yet')
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
  }

  public async getMessages(params: { topic: string }) {
    return this.postToExternalProvider('getMessages', params)
  }

  public async leave(params: { topic: string }) {
    return this.postToExternalProvider('leave', params)
  }
  public async reject(params: { id: number }) {
    return this.postToExternalProvider('reject', params)
  }

  public async accept(params: { id: number }) {
    return this.postToExternalProvider('accept', params)
  }
  public async getThreads(params?: { account: string }) {
    return this.postToExternalProvider('getThreads', params)
  }

  public async getSentInvites(params: { account: string }) {
    return this.postToExternalProvider('getSentInvites', params)
  }

  public async getReceivedInvites(params: { account: string }) {
    return this.postToExternalProvider('getReceivedInvites', params)
  }

  public async goPublic(params: { account: string }) {
    return this.postToExternalProvider('goPublic', params)
  }

  public async goPrivate(params: { account: string }) {
    return this.postToExternalProvider('goPrivate', params)
  }

  public async invite(params: ChatClientTypes.Invite) {
    return this.postToExternalProvider('invite', params)
  }
  public async ping(params: { topic: string }) {
    return this.postToExternalProvider('ping', params)
  }
  public async message(params: ChatClientTypes.Message) {
    return this.postToExternalProvider('message', params)
  }

  public async unregister(params: { account: string }) {
    return this.postToExternalProvider('unregister', params)
  }

  public async register(params: { account: string; private?: boolean | undefined }) {
    return this.postToExternalProvider('register', {
      ...params,
      // Signing will be handled wallet-side.
      onSign: async () => Promise.resolve('')
    })
  }

  public async resolve(params: { account: string }) {
    return this.postToExternalProvider('resolve', params)
  }

  public async muteContact({ topic }: { topic: string }) {
    return this.postToExternalProvider('muteContact', { topic })
  }

  public async unmuteContact({ topic }: { topic: string }) {
    return this.postToExternalProvider('unmuteContact', { topic })
  }

  public async getMutedContacts() {
    return this.postToExternalProvider('getMutedContacts')
  }
}
