import type { ExternalCommunicator } from './communicatorType'
import type { EventEmitter } from 'events'
import type { JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        web3inboxNotify?: {
          postMessage: (message: unknown) => void
        }
        web3inboxChat?: {
          postMessage: (message: unknown) => void
        }
      }
    }
  }
}

export class IOSCommunicator implements ExternalCommunicator {
  private readonly emitter: EventEmitter

  public constructor(emitter: EventEmitter) {
    this.emitter = emitter
  }

  public async postToExternalProvider<TReturn>(
    methodName: string,
    params: unknown,
    target: 'chat' | 'notify'
  ) {
    return new Promise<TReturn>(resolve => {
      const message = formatJsonRpcRequest(methodName, params)

      const messageListener = (messageResponse: JsonRpcResult<TReturn>) => {
        resolve(messageResponse.result)
      }
      this.emitter.once(message.id.toString(), messageListener)
      switch (target) {
        case 'chat':
          if (window.webkit?.messageHandlers?.web3inboxChat) {
            window.webkit.messageHandlers.web3inboxChat.postMessage(JSON.stringify(message))
          }
          break
        case 'notify':
          if (window.webkit?.messageHandlers?.web3inboxNotify) {
            window.webkit.messageHandlers.web3inboxNotify.postMessage(JSON.stringify(message))
          }
          break
        default:
          throw new Error('Unsupported target for communicator')
      }
    })
  }
}
