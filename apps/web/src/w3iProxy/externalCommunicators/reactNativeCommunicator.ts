import type { JsonRpcResult } from '@walletconnect/jsonrpc-utils'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { EventEmitter } from 'events'
import type { ExternalCommunicator, TTargetClient } from './communicatorType'

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: unknown) => void
    }
  }
}

export class ReactNativeCommunicator implements ExternalCommunicator {
  private readonly emitter: EventEmitter
  private readonly targetClient: TTargetClient

  public constructor(emitter: EventEmitter, targetClient: TTargetClient) {
    this.emitter = emitter
    this.targetClient = targetClient
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private reviver(key: string, value: any) {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value)
      }
    }

    return value
  }

  public async postToExternalProvider<TReturn>(methodName: string, params: unknown) {
    return new Promise<TReturn>(resolve => {
      const message = formatJsonRpcRequest(methodName, params)

      const messageListener = (messageResponse: JsonRpcResult<TReturn>) => {
        const messageResult = JSON.parse(messageResponse.result as string, this.reviver)
        resolve(messageResult)
      }
      this.emitter.once(message.id.toString(), messageListener)
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ ...message, targetClient: this.targetClient })
        )
      }
    })
  }
}
