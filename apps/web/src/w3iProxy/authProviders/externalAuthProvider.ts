import type { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import type { EventEmitter } from 'events'
import { AndroidCommunicator } from '../externalCommunicators/androidCommunicator'
import type { ExternalCommunicator } from '../externalCommunicators/communicatorType'
import { IOSCommunicator } from '../externalCommunicators/iosCommunicator'
import { JsCommunicator } from '../externalCommunicators/jsCommunicator'
import { ReactNativeCommunicator } from '../externalCommunicators/reactNativeCommunicator'

export default class ExternalAuthProvider {
  protected readonly emitter: EventEmitter
  protected readonly communicator: ExternalCommunicator
  public providerName = 'ExternalAuthProvider'

  private readonly methodsListenedTo = ['auth_set_account']

  private account?: string

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
        this.communicator = new ReactNativeCommunicator(this.emitter, 'auth')
        break
      default:
        this.communicator = new JsCommunicator(this.emitter)
        break
    }
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    switch (request.method) {
      case 'setAccount':
        this.account = (request.params as { account: string }).account
        this.emitter.emit('auth_account_change', request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
  }

  public getAccount() {
    return this.account
  }

  public setAccount(account: string) {
    this.account = account
  }
}
