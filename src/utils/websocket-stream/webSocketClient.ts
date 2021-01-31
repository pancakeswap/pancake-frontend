import createEvent, { EventEmitter } from './event-emitter'

export interface WebSocketClient {
  open(): void
  send(data: any): void
  refresh(): void
  close(): void
  onOpen(fn: onOpen): () => void
  onMessage(fn: onMessage): () => void
  onClose(fn: onClose): () => void
  getStatus(): Status
}

export type onOpen = (event: Event) => void

export type onMessage = (event: MessageEvent) => void

export type onClose = (event: CloseEvent) => void

export const ClientStatus = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 3,
} as const

type StatusMap = typeof ClientStatus

type Status = StatusMap[keyof StatusMap]

let uid = 1

class WebSocketClientImpl implements WebSocketClient {
  private _debugId = uid++

  private _url: string

  private _wsInstance: WebSocket | null = null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _reconnectHandle: any

  private _reconnectAttempts = 0

  private _maxReconnectAttempts = 10

  private _socketEvents: EventEmitter = createEvent()

  private _readyState: Status = ClientStatus.CONNECTING

  private _timeout = 5000

  constructor(url: string) {
    this._url = url
  }

  open(reConnect = false) {
    if (this._readyState === ClientStatus.OPEN) {
      return
    }

    if (reConnect) {
      this._reconnectAttempts += 1
      if (this._reconnectAttempts >= this._maxReconnectAttempts) {
        return
      }

      console.log('WebSocket Reconnecting Attempts:', this._url, this._reconnectAttempts)
    } else {
      this._reconnectAttempts = 0
    }

    const ws = new WebSocket(this._url)
    this._wsInstance = ws
    let hasTimeout = false
    const timeout = setTimeout(() => {
      // eslint-disable-next-line no-console
      console.debug('WebSocket connection-timeout', this._url)
      hasTimeout = true
      ws.close()
      hasTimeout = false
    }, this._timeout)
    const cancelTimeout = () => clearTimeout(timeout)

    ws.onerror = (event: Event) => {
      // eslint-disable-next-line no-console
      console.error('socket error', this._url, event)
    }

    ws.onclose = (event: CloseEvent) => {
      cancelTimeout()
      this._wsInstance = null
      this._readyState = ClientStatus.CONNECTING
      if (this._reconnectAttempts <= 0 && !hasTimeout) {
        this._socketEvents.emit('close', event)
      }
      this.reconnect()
    }

    ws.onopen = (event: Event) => {
      cancelTimeout()
      this._readyState = ClientStatus.OPEN
      this._reconnectAttempts = 0
      this._socketEvents.emit('open', event)
    }

    ws.onmessage = (event: MessageEvent) => {
      this._socketEvents.emit('message', event)
    }
  }

  onOpen(cb: onOpen) {
    this._socketEvents.on('open', cb)

    return () => {
      this._socketEvents.off('open', cb)
    }
  }

  onMessage(cb: onMessage) {
    this._socketEvents.on('message', cb)

    return () => {
      this._socketEvents.off('message', cb)
    }
  }

  onClose(cb: onClose) {
    this._socketEvents.on('close', cb)

    return () => {
      this._socketEvents.off('close', cb)
    }
  }

  send(x: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
    if (this._wsInstance && this.getStatus() === ClientStatus.OPEN) {
      this._wsInstance.send(x)
    }
  }

  close(): void {
    const ws = this._wsInstance
    if (!ws) {
      return
    }

    this._wsInstance = null
    this._readyState = ClientStatus.CLOSED

    ws.onopen = null
    ws.onerror = null
    ws.onmessage = null
    ws.onclose = () => {
      this._socketEvents.emit('close', event)
    }
    ws.close()
  }

  getStatus(): Status {
    return this._readyState
  }

  refresh() {
    if (this._wsInstance) {
      this._wsInstance.close()
    }
  }

  private reconnect() {
    if (this._reconnectHandle) {
      return
    }

    this._reconnectHandle = setTimeout(() => {
      this._reconnectHandle = null
      this.open(true)
    }, this.calcReconnectTime())
  }

  private calcReconnectTime() {
    return 2 ** this._reconnectAttempts * 1000
  }
}

export function websocket(url: string): WebSocketClient {
  return new WebSocketClientImpl(url)
}
