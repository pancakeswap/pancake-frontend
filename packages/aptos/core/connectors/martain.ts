import { InjectedConnector } from './injected'

declare global {
  interface Window {
    martain?: any
  }
}

export class MartainConnector extends InjectedConnector {
  readonly id = 'Martain'

  readonly ready = typeof window !== 'undefined' && !!window.martain

  constructor() {
    super({
      name: 'Martain',
    })
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.martain) this.provider = window.martain
    return this.provider
  }
}
