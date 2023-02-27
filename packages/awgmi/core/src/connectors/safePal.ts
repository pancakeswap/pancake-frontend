import { Chain } from '../chain'

import { MartianConnector } from './martian'

declare global {
  interface Window {
    safePal?: any
  }
}

export type MartianConnectorOptions = {
  /** Id of connector */
  id?: string
  /** Name of connector */
  name?: string
}

export class SafePalConnector extends MartianConnector {
  readonly id: string
  readonly name: string

  readonly ready = typeof window !== 'undefined' && !!window.safePal
  constructor(config: { chains?: Chain[]; options?: MartianConnectorOptions } = {}) {
    const options = {
      id: config.options?.id || 'safePal',
      name: config.options?.name || 'SafePal',
    }

    super({
      chains: config.chains,
      options,
    })

    this.id = options.id
    this.name = options.name
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.safePal) this.provider = window.safePal
    return this.provider
  }
}
