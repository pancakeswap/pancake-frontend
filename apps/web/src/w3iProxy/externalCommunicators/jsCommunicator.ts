import type { ExternalCommunicator } from './communicatorType'
import type { EventEmitter } from 'events'
import type { JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'

export class JsCommunicator implements ExternalCommunicator {
  private readonly emitter: EventEmitter

  public constructor(emitter: EventEmitter) {
    this.emitter = emitter
  }

  public async postToExternalProvider<TReturn>(
    methodName: string,
    params: unknown,
    _: 'chat' | 'notify'
  ) {
    return new Promise<TReturn>(resolve => {
      const message = formatJsonRpcRequest(methodName, params)

      const messageListener = (messageResponse: JsonRpcResult<TReturn>) => {
        resolve(messageResponse.result)
      }

      this.emitter.once(message.id.toString(), messageListener)

      const externalMessageListener = (messageEvent: MessageEvent) => {
        if (messageEvent.data.id === message.id || messageEvent.data.id === message.id.toString()) {
          if (messageEvent.data.result) {
            window.removeEventListener('message', externalMessageListener)
            resolve(messageEvent.data.result)
          }
        }
      }

      window.addEventListener('message', externalMessageListener)

      // Emit both to allow for debugging and widget usage
      window.parent.postMessage(message, window.web3inbox.dappOrigin)
      this.emitter.emit(methodName, message)
    })
  }
}
