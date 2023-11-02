globalThis.document = {
  readyState: 'complete',
  getElementsByTagName: () => [] as any,
  // @ts-expect-error partial polyfill for @datadog/browser-logs
  location: {
    hostname: 'hostname.com',
    href: '',
  },
  get cookie() {
    return ''
  },
  set cookie(cookie: any) {},
  addEventListener: () => {},
  removeEventListener: () => {},
}

globalThis.window = {
  TextEncoder: globalThis.TextEncoder,
  fetch: globalThis.fetch,
  // @ts-expect-error partial polyfill for @datadog/browser-logs
  location: {
    hostname: '',
    href: '',
  },
  addEventListener: () => {},
  removeEventListener: () => {},
}

globalThis.performance = {
  // @ts-expect-error partial polyfill for @datadog/browser-logs
  timing: {
    navigationStart: 0,
  },
  now: () => 0,
}

class XMLHttpRequestWithFetch {
  private method: string | null

  private url: string | null

  private status: number

  private listeners: any

  constructor() {
    this.method = null
    this.url = null
    this.status = 500
    this.listeners = {}
  }

  open(method: string, url: string) {
    this.method = method
    this.url = url
  }

  addEventListener(eventName: string, cb: any) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = []
    }
    this.listeners[eventName].push(cb)
  }

  removeEventListener(eventName: string, cb: any) {
    const handlers = this.listeners[eventName]
    if (handlers) {
      const restOfHandlers = handlers.filter((callback: any) => callback !== cb)
      if (restOfHandlers && restOfHandlers.length) {
        this.listeners[eventName] = restOfHandlers
      } else {
        delete this.listeners[eventName]
      }
    }
  }

  send(data: any) {
    let _body = data
    if (typeof data === 'object') {
      _body = JSON.stringify(data)
    }
    if (!this.url) {
      return
    }
    fetch(this.url, {
      method: this.method || 'GET',
      body: _body,
    })
      .then((response) => {
        this.status = response.status
        // notify all listeners that we're done
        Object.keys(this.listeners).forEach((event) => {
          this.listeners[event].forEach((handler: any) => handler(response))
        })
      })
      .catch(() => {
        // @TODO: probably we should handle the failing case.
      })
  }
}

// @ts-expect-error partial polyfill for @datadog/browser-logs
globalThis.XMLHttpRequest = XMLHttpRequestWithFetch
