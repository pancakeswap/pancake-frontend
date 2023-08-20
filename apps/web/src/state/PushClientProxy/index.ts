import { Core } from '@walletconnect/core'
import { WalletClient as PushWalletClient } from '@walletconnect/push-client'
import type { ISyncClient } from '@walletconnect/sync-client'
import { SyncClient, SyncStore } from '@walletconnect/sync-client'
import type { ICore } from '@walletconnect/types'
import { signMessage } from 'wagmi/actions'
import { EventEmitter } from 'events'
import InternalPushProvider from './internalPushProvider'

export type PushClient = Omit<InternalPushProvider, 'initState'>

declare global {
  interface Window {
    web3inbox: PushClientProxy
  }
}

class PushClientProxy {
  private readonly pushFacade: InternalPushProvider

  public emitter: EventEmitter

  private pushClient?: PushWalletClient

  private readonly relayUrl?: string

  private readonly projectId: string

  private syncClient: ISyncClient | undefined

  private readonly core: ICore | undefined

  public readonly signMessage: (message: string) => Promise<string>

  private isInitialized = false

  private constructor(projectId: string, relayUrl: string) {
    this.emitter = new EventEmitter()
    this.pushFacade = new InternalPushProvider(this.emitter)
    this.relayUrl = relayUrl
    this.projectId = projectId
    this.core = new Core({
      logger: 'debug',
      relayUrl: this.relayUrl,
      projectId: this.projectId,
    })

    this.signMessage = async (message: string) => {
      return signMessage({ message })
    }
  }

  public static getProxy(projectId: string, relayUrl: string) {
    window.web3inbox = new PushClientProxy(projectId, relayUrl)
    return window.web3inbox
  }

  public get push(): InternalPushProvider {
    return this.pushFacade
  }

  public getInitComplete() {
    if (!this.isInitialized || !this.pushClient) {
      return false
    }
    return true
  }

  public async init() {
    if (this.isInitialized) {
      return
    }

    // If core is initialized, we should init sync because some SDK needs it
    if (!this.syncClient && this.core) {
      this.syncClient = await SyncClient.init({
        core: this.core,
        projectId: this.projectId,
      })
    }

    if (!this.pushClient) {
      this.pushClient = await PushWalletClient.init({
        logger: 'info',
        SyncStoreController: SyncStore,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        syncClient: this.syncClient!,
        core: this.core,
      })

      this.pushFacade.initState(this.pushClient)
    }
    this.isInitialized = true
  }
}

export default PushClientProxy
