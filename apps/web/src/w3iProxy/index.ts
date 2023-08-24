import { signMessage } from 'wagmi/actions'
import ChatClient from '@walletconnect/chat-client'
import { Core } from '@walletconnect/core'
import { IdentityKeys } from '@walletconnect/identity-keys'
import { NotifyClient } from '@walletconnect/notify-client'
import type { ISyncClient } from '@walletconnect/sync-client'
import { SyncClient, SyncStore } from '@walletconnect/sync-client'
import type { ICore } from '@walletconnect/types'
import { EventEmitter } from 'events'
import type { UiEnabled } from '../contexts/W3iContext/context'
import { JsCommunicator } from './externalCommunicators/jsCommunicator'
import W3iAuthFacade from './w3iAuthFacade'
import W3iChatFacade from './w3iChatFacade'
import W3iPushFacade from './w3iPushFacade'

export type W3iChatClient = Omit<W3iChatFacade, 'initState'>
export type W3iPushClient = Omit<W3iPushFacade, 'initState'>

declare global {
  interface Window {
    web3inbox: Web3InboxProxy
  }
}

class Web3InboxProxy {
  private readonly chatFacade: W3iChatFacade
  private readonly chatProvider: W3iChatFacade['providerName']
  private chatClient?: ChatClient
  private readonly pushFacade: W3iPushFacade
  private readonly pushProvider: W3iPushFacade['providerName']
  private pushClient?: NotifyClient
  private readonly authFacade: W3iAuthFacade
  private readonly authProvider: W3iAuthFacade['providerName']
  private readonly relayUrl?: string
  private readonly projectId: string
  private readonly uiEnabled: UiEnabled
  private syncClient: ISyncClient | undefined
  private readonly core: ICore | undefined
  private readonly emitter: EventEmitter

  private identityKeys?: IdentityKeys

  public readonly dappOrigin: string

  public readonly signMessage: (message: string) => Promise<string>

  private isInitialized = false

  /**
   *
   */
  private constructor(
    chatProvider: Web3InboxProxy['chatProvider'],
    pushProvider: Web3InboxProxy['pushProvider'],
    authProvider: Web3InboxProxy['authProvider'],
    dappOrigin: string,
    projectId: string,
    relayUrl: string,
    uiEnabled: UiEnabled
  ) {
    // Bind Chat properties
    this.chatProvider = chatProvider
    this.chatFacade = new W3iChatFacade(this.chatProvider)
    // Bind Push properties
    this.pushProvider = pushProvider
    this.pushFacade = new W3iPushFacade(this.pushProvider)
    // Bind Auth Properties
    this.authProvider = authProvider
    this.authFacade = new W3iAuthFacade(this.authProvider)
    // Bind other configuration properties
    this.relayUrl = relayUrl
    this.projectId = projectId
    this.uiEnabled = uiEnabled
    this.emitter = new EventEmitter()
    if (this.chatProvider === 'internal' || this.pushProvider === 'internal') {
      this.core = new Core({
        logger: 'debug',
        relayUrl: this.relayUrl,
        projectId: this.projectId
      })
    }

    this.dappOrigin = dappOrigin

    // If dappOrigin is provided, it is assumed that web3inbox is currently operating as a widget
    this.signMessage = async (message: string) => {
      return signMessage({ message })
    }
  }

  public static getProxy(
    chatProvider: Web3InboxProxy['chatProvider'],
    pushProvider: Web3InboxProxy['pushProvider'],
    authProvider: Web3InboxProxy['authProvider'],
    dappOrigin: string,
    projectId: string,
    relayUrl: string,
    uiEnabled: UiEnabled
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!window.web3inbox) {
      window.web3inbox = new Web3InboxProxy(
        chatProvider,
        pushProvider,
        authProvider,
        dappOrigin,
        projectId,
        relayUrl,
        uiEnabled
      )
    }

    return window.web3inbox
  }

  public get chat(): W3iChatClient {
    return this.chatFacade
  }

  public get notify(): W3iPushFacade {
    return this.pushFacade
  }

  public get auth(): W3iAuthFacade {
    return this.authFacade
  }

  public getInitComplete() {
    if (!this.isInitialized) {
      return false
    }
    if (this.chatProvider === 'internal') {
      if (!this.chatClient) {
        return false
      }
    }
    if (this.pushProvider === 'internal') {
      if (!this.pushClient) {
        return false
      }
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
        projectId: this.projectId
      })
    }

    if (this.core) {
      this.identityKeys = new IdentityKeys(this.core)
    }

    if (this.chatProvider === 'internal' && !this.chatClient) {
      this.chatClient = await ChatClient.init({
        projectId: this.projectId,
        SyncStoreController: SyncStore,
        identityKeys: this.identityKeys,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        syncClient: this.syncClient!,
        core: this.core,
        keyserverUrl: 'https://keys.walletconnect.com'
      })
      await this.chatFacade.initInternalProvider(this.chatClient)
    }

    if (this.pushProvider === 'internal' && !this.pushClient) {
      console.log('initttingggggggggg')
      this.pushClient = await NotifyClient.init({
        SyncStoreController: SyncStore,
        identityKeys: this.identityKeys,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        syncClient: this.syncClient!,
        core: this.core
      })

      this.pushFacade.initInternalProvider(this.pushClient)
    }

    if (this.authProvider === 'internal') {
      this.authFacade.initInternalProvider()
    }

    this.isInitialized = true
  }
}

export default Web3InboxProxy
