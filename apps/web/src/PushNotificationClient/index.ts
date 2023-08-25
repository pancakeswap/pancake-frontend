import { signMessage } from 'wagmi/actions'
import { Core } from '@walletconnect/core'
import { IdentityKeys } from '@walletconnect/identity-keys'
import { NotifyClient } from '@walletconnect/notify-client'
import type { ISyncClient } from '@walletconnect/sync-client'
import { SyncClient, SyncStore } from '@walletconnect/sync-client'
import type { ICore } from '@walletconnect/types'
import { EventEmitter } from 'events'
import InternalPushProvider from './internalPushProvider'
import InternalAuthProvider from './internalAuthProvider'

export type PushClient = Omit<InternalPushProvider, 'initState'>

declare global {
  interface Window {
    web3inbox: PushClientProxy
  }
}

class PushClientProxy {
  private pushFacade: InternalPushProvider

  private pushClient?: NotifyClient

  private authFacade: InternalAuthProvider

  private readonly relayUrl?: string

  private readonly projectId: string

  public syncClient: ISyncClient | undefined

  private readonly core: ICore | undefined

  public emitter: EventEmitter

  private identityKeys?: IdentityKeys

  public readonly signMessage: (message: string) => Promise<string>

  private isInitialized = false

  /**
   *
   */
  private constructor(projectId: string, relayUrl: string) {
    this.relayUrl = relayUrl
    this.projectId = projectId
    this.emitter = new EventEmitter()
    this.authFacade = new InternalAuthProvider(this.emitter)
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!window.web3inbox) {
      window.web3inbox = new PushClientProxy(projectId, relayUrl)
    }
    return window.web3inbox
  }

  public get notify(): InternalPushProvider {
    return this.pushFacade
  }

  public get auth(): InternalAuthProvider {
    return this.authFacade
  }

  public getInitComplete() {
    if (!this.isInitialized) {
      return false
    }
    if (!this.pushClient) return false
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

    if (this.core) {
      // @ts-ignore
      this.identityKeys = new IdentityKeys(this.core)
    }

    if (!this.pushClient) {
      this.pushClient = await NotifyClient.init({
        SyncStoreController: SyncStore,
        identityKeys: this.identityKeys,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        syncClient: this.syncClient!,
        core: this.core,
      })

      this.pushFacade = new InternalPushProvider(this.emitter)
      this.pushFacade.initState(this.pushClient)
    }
    setTimeout(() => this.authFacade.initState(), 2000)
    this.isInitialized = true
  }
}

export default PushClientProxy
