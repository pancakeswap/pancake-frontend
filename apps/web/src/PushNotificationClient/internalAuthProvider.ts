import { getAccount, watchAccount } from 'wagmi/actions'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { EventEmitter } from 'events'

export default class InternalAuthProvider {
  private readonly methodsListenedTo = ['auth_set_account']

  public providerName = 'InternalAuthProvider'

  public account?: string

  public emitter: EventEmitter

  public constructor(emitter: EventEmitter) {
    this.emitter = emitter
    watchAccount((account) => {
      console.log('watching adddddddddressssssss')
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      // if (!account.address || !window.web3inbox.notify) {
      //   this.emitter.emit('auth_set_account', { account: null })

      //   return
      // }

      this.emitter.emit('auth_set_account', { account: account.address })
    })
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
  }

  // Method to be used by external providers. Not internal use.
  public postMessage(messageData: JsonRpcRequest<unknown>) {
    this.emitter.emit(messageData.id.toString(), messageData)
    switch (messageData.method) {
      default:
        if (this.isListeningToMethodFromPostMessage(messageData.method)) {
          this.handleMessage(messageData)
        }
    }
  }

  public handleMessage(request: JsonRpcRequest<unknown>) {
    switch (request.method) {
      case 'setAccount':
        this.account = (request.params as { account: string }).account
        this.emitter.emit('auth_set_account', request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider ${this.providerName}`)
    }
  }

  public async initState() {
    this.account = getAccount().address
    console.log(getAccount().address)
    if (this.account) {
      this.emitter.emit('auth_set_account', { account: this.account })
    }

    return Promise.resolve()
  }

  public getAccount() {
    return this.account
  }

  public setAccount(account: string) {
    this.account = account
  }
}
