import { getAccount, watchAccount } from 'wagmi/actions'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import type { EventEmitter } from 'events'

export default class InternalAuthProvider {
  private readonly methodsListenedTo = ['auth_set_account']
  public providerName = 'InternalAuthProvider'
  public account?: string
  protected readonly emitter: EventEmitter

  public constructor(emitter: EventEmitter, _name = 'InternalAuthProvider') {
    this.emitter = emitter
    watchAccount(account => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!account.address || !window.web3inbox.chat) {
        this.emitter.emit('auth_set_account', { account: null })

        return
      }

      this.emitter.emit('auth_set_account', { account: account.address })
    })
  }

  public isListeningToMethodFromPostMessage(method: string) {
    return this.methodsListenedTo.includes(method)
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
