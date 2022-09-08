import { EntryFunctionPayload, PendingTransaction } from 'aptos/dist/generated'
import { ConnectorNotFoundError } from './errors'
import { PetraConnector } from './petra'

declare global {
  interface Window {
    martian?: any
  }
}

export class MartianConnector extends PetraConnector {
  readonly id = 'martian'
  provider?: Window['martian']

  readonly ready = typeof window !== 'undefined' && !!window.martian

  constructor() {
    super({
      name: 'Martian',
    })
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.martian) this.provider = window.martian
    return this.provider
  }

  async network() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return 'Devnet'
  }

  async signAndSubmitTransaction(tx: EntryFunctionPayload): Promise<PendingTransaction> {
    const provider = await this.getProvider()
    const account = await this.account()
    if (!provider) throw new ConnectorNotFoundError()
    const generatedTx = await provider.generateTransaction(account?.address || '', tx)
    return provider.signAndSubmitTransaction(generatedTx)
  }
}
