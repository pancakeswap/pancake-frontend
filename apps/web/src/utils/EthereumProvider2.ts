import { EventEmitter } from 'events'
import { getAccountsFromNamespaces, getSdkError, isValidArray } from '@walletconnect/utils'
import { KeyValueStorageOptions } from '@walletconnect/keyvaluestorage'
import { Metadata, Namespace, UniversalProvider } from '@walletconnect/universal-provider'
import type { WalletConnectModalConfig, WalletConnectModal } from '@walletconnect/modal'
import { SessionTypes, SignClientTypes } from '@walletconnect/types'
// eslint-disable-next-line import/no-cycle
import { DappClient } from '@walletconnect/push-client'
import { Core } from '@walletconnect/core'
import AuthClient, { generateNonce } from '@walletconnect/auth-client'
import SignClient from '@walletconnect/sign-client'
// eslint-disable-next-line import/no-cycle
import {
  IEthereumProvider as IProvider,
  IEthereumProviderEvents,
  RequestArguments,
  ProviderAccounts,
} from './EthereumProvidertypes'

const relayUrl = process.env.NEXT_PUBLIC_RELAY_URL || 'wss://relay.walletconnect.com'

export const PROTOCOL = 'wc'
export const WC_VERSION = 2
export const CONTEXT = 'ethereum_provider'
export const STORAGE_KEY = `${PROTOCOL}@${WC_VERSION}:${CONTEXT}:`
export const RPC_URL = 'https://rpc.walletconnect.com/v1/'

export const REQUIRED_METHODS = ['eth_sendTransaction', 'personal_sign']
export const OPTIONAL_METHODS = [
  'eth_accounts',
  'eth_requestAccounts',
  'eth_sendRawTransaction',
  'eth_sign',
  'eth_signTransaction',
  'eth_signTypedData',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
  'wallet_switchEthereumChain',
  'wallet_addEthereumChain',
  'wallet_getPermissions',
  'wallet_requestPermissions',
  'wallet_registerOnboarding',
  'wallet_watchAsset',
  'wallet_scanQRCode',
]
export const REQUIRED_EVENTS = ['chainChanged', 'accountsChanged']
export const OPTIONAL_EVENTS = ['message', 'disconnect', 'connect']

export type QrModalOptions = Pick<
  WalletConnectModalConfig,
  | 'themeMode'
  | 'themeVariables'
  | 'desktopWallets'
  | 'enableExplorer'
  | 'explorerRecommendedWalletIds'
  | 'explorerExcludedWalletIds'
  | 'mobileWallets'
  | 'privacyPolicyUrl'
  | 'termsOfServiceUrl'
  | 'walletImages'
>

export type RpcMethod =
  | 'personal_sign'
  | 'eth_sendTransaction'
  | 'eth_accounts'
  | 'eth_requestAccounts'
  | 'eth_call'
  | 'eth_getBalance'
  | 'eth_sendRawTransaction'
  | 'eth_sign'
  | 'eth_signTransaction'
  | 'eth_signTypedData'
  | 'eth_signTypedData_v3'
  | 'eth_signTypedData_v4'
  | 'wallet_switchEthereumChain'
  | 'wallet_addEthereumChain'
  | 'wallet_getPermissions'
  | 'wallet_requestPermissions'
  | 'wallet_registerOnboarding'
  | 'wallet_watchAsset'
  | 'wallet_scanQRCode'

export type RpcEvent = 'accountsChanged' | 'chainChanged' | 'message' | 'disconnect' | 'connect'

export interface EthereumRpcMap {
  [chainId: string]: string
}

export interface SessionEvent {
  event: { name: string; data: any }
  chainId: string
}

export interface EthereumRpcConfig {
  chains: string[]
  optionalChains: string[]
  methods: string[]
  optionalMethods?: string[]
  /**
   * @description Events that the wallet MUST support or the connection will be rejected
   */
  events: string[]
  optionalEvents?: string[]
  rpcMap: EthereumRpcMap
  projectId: string
  metadata?: Metadata
  showQrModal: boolean
  qrModalOptions?: QrModalOptions
}
export interface ConnectOps {
  chains?: number[]
  optionalChains?: number[]
  rpcMap?: EthereumRpcMap
  pairingTopic?: string
}

export interface IEthereumProvider extends IProvider {
  connect(opts?: ConnectOps | undefined): Promise<void>
}

export function getRpcUrl(chainId: string, rpc: EthereumRpcConfig): string | undefined {
  let rpcUrl: string | undefined
  if (rpc.rpcMap) {
    rpcUrl = rpc.rpcMap[getEthereumChainId([chainId])]
  }
  return rpcUrl
}

export function getEthereumChainId(chains: string[]): number {
  return Number(chains[0].split(':')[1])
}

export function toHexChainId(chainId: number): string {
  return `0x${chainId.toString(16)}`
}

export type NamespacesParams = {
  chains: EthereumRpcConfig['chains']
  optionalChains: EthereumRpcConfig['optionalChains']
  methods?: EthereumRpcConfig['methods']
  optionalMethods?: EthereumRpcConfig['methods']
  events?: EthereumRpcConfig['events']
  rpcMap: EthereumRpcConfig['rpcMap']
  optionalEvents?: EthereumRpcConfig['events']
}

export function buildNamespaces(params: NamespacesParams): {
  required?: Namespace
  optional?: Namespace
} {
  const { chains, optionalChains, methods, optionalMethods, events, optionalEvents, rpcMap } = params
  if (!isValidArray(chains)) {
    throw new Error('Invalid chains')
  }

  const required: Namespace = {
    chains,
    methods: methods || REQUIRED_METHODS,
    events: events || REQUIRED_EVENTS,
    rpcMap: {
      ...(chains.length ? { [getEthereumChainId(chains)]: rpcMap[getEthereumChainId(chains)] } : {}),
    },
  }

  // make a list of events and methods that require additional permissions
  // so we know if we should to include the required chains in the optional namespace
  const eventsRequiringPermissions = events?.filter((event) => !REQUIRED_EVENTS.includes(event))
  const methodsRequiringPermissions = methods?.filter((event) => !REQUIRED_METHODS.includes(event))

  if (
    !optionalChains &&
    !optionalEvents &&
    !optionalMethods &&
    !eventsRequiringPermissions?.length &&
    !methodsRequiringPermissions?.length
  ) {
    return { required: chains.length ? required : undefined }
  }

  /*
   * decides whether or not to include the required chains in the optional namespace
   * use case: if there is a single chain as required but additonal methods/events as optional
   */
  const shouldIncludeRequiredChains =
    (eventsRequiringPermissions?.length && methodsRequiringPermissions?.length) || !optionalChains

  const optional: Namespace = {
    chains: [...new Set(shouldIncludeRequiredChains ? required.chains.concat(optionalChains || []) : optionalChains)],
    methods: [...new Set(required.methods.concat(optionalMethods?.length ? optionalMethods : OPTIONAL_METHODS))],
    events: [...new Set(required.events.concat(optionalEvents || OPTIONAL_EVENTS))],
    rpcMap,
  }

  return {
    required: chains.length ? required : undefined,
    optional: optionalChains.length ? optional : undefined,
  }
}

// helper type to force setting at least one value in an array
type ArrayOneOrMore<T> = {
  0: T
} & Array<T>

/**
 * @param {number[]} chains - The Chains your app intents to use and the peer MUST support. If the peer does not support these chains, the connection will be rejected.
 * @param {number[]} optionalChains - The Chains your app MAY attempt to use and the peer MAY support. If the peer does not support these chains, the connection will still be established.
 * @description either chains or optionalChains must be provided
 */
export type ChainsProps =
  | {
      chains: ArrayOneOrMore<number>
      optionalChains?: number[]
    }
  | {
      chains?: number[]
      optionalChains: ArrayOneOrMore<number>
    }

export type EthereumProviderOptions = {
  projectId: string
  /**
   * @note Methods that your app intents to use and the peer MUST support. If the peer does not support these methods, the connection will be rejected.
   * @default ["eth_sendTransaction", "personal_sign"]
   */
  methods?: string[]
  /**
   * @note Methods that your app MAY attempt to use and the peer MAY support. If the peer does not support these methods, the connection will still be established.
   */
  optionalMethods?: string[]
  events?: string[]
  optionalEvents?: string[]
  rpcMap?: EthereumRpcMap
  metadata?: Metadata
  showQrModal: boolean
  qrModalOptions?: QrModalOptions
  disableProviderPing?: boolean
  relayUrl?: string
  storageOptions?: KeyValueStorageOptions
} & ChainsProps

export class EthereumProvider implements IEthereumProvider {
  public events = new EventEmitter()

  public namespace = 'eip155'

  public accounts: string[] = []

  public signer: InstanceType<typeof UniversalProvider>

  public pushClient: DappClient

  public authClient: AuthClient

  public chainId = 1

  public modal?: WalletConnectModal

  protected rpc: EthereumRpcConfig

  protected readonly STORAGE_KEY = STORAGE_KEY

  constructor() {
    // assigned during initialize
    this.signer = {} as InstanceType<typeof UniversalProvider>
    this.pushClient = {} as DappClient
    this.authClient = {} as AuthClient
    this.rpc = {} as EthereumRpcConfig
  }

  static async init(opts: EthereumProviderOptions): Promise<EthereumProvider> {
    const provider = new EthereumProvider()
    await provider.initialize(opts)
    return provider
  }

  public async request<T = unknown>(args: RequestArguments): Promise<T> {
    // eslint-disable-next-line no-return-await
    return await this.signer.request(args, this.formatChainId(this.chainId))
  }

  public sendAsync(args: RequestArguments, callback: (error: Error | null, response: any) => void): void {
    this.signer.sendAsync(args, callback, this.formatChainId(this.chainId))
  }

  get connected(): boolean {
    if (!this.signer.client) return false
    return this.signer.client.core.relayer.connected
  }

  get connecting(): boolean {
    if (!this.signer.client) return false
    return this.signer.client.core.relayer.connecting
  }

  public async enable(): Promise<ProviderAccounts> {
    if (!this.session) await this.connect()
    const accounts = await this.request({ method: 'eth_requestAccounts' })
    return accounts as ProviderAccounts
  }

  public async connect(opts?: ConnectOps): Promise<void> {
    if (!this.signer.client) {
      throw new Error('Provider not initialized. Call init() first')
    }

    this.loadConnectOpts(opts)
    const { required, optional } = buildNamespaces(this.rpc)
    try {
      // eslint-disable-next-line no-async-promise-executor
      const session = await new Promise<SessionTypes.Struct | undefined>(async (resolve, reject) => {
        if (this.rpc.showQrModal) {
          this.modal?.subscribeModal((state) => {
            // the modal was closed so reject the promise
            if (!state.open && !this.signer.session) {
              this.signer.abortPairingAttempt()
              reject(new Error('Connection request reset. Please try again.'))
            }
          })
        }
        await this.signer
          .connect({
            namespaces: {
              ...(required && {
                [this.namespace]: required,
              }),
            },
            ...(optional && {
              optionalNamespaces: {
                [this.namespace]: optional,
              },
            }),
            pairingTopic: opts?.pairingTopic,
          })
          // eslint-disable-next-line @typescript-eslint/no-shadow
          .then((session) => {
            resolve(session)
          })
          .catch((error: Error) => {
            reject(new Error(error.message))
          })
      })
      if (!session) return
      this.setChainIds(this.rpc.chains)
      const accounts = getAccountsFromNamespaces(session.namespaces, [this.namespace])
      this.setAccounts(accounts)
      this.events.emit('connect', { chainId: toHexChainId(this.chainId) })
    } catch (error) {
      this.signer.logger.error(error)
      throw error
    } finally {
      if (this.modal) this.modal.closeModal()
    }
  }

  public async connectWithAuthClient(): Promise<void> {
    this.authClient
      .request({
        aud: window.location.href,
        domain: window.location.hostname.split('.').slice(-2).join('.'),
        chainId: 'eip155:1',
        type: 'eip4361',
        nonce: generateNonce(),
        statement: 'Sign in with wallet.',
      })
      .then(async ({ uri }) => {
        if (uri && this.modal) {
          await this.modal.openModal({
            uri,
            standaloneChains: ['eip155:1'],
          })
        }
      })
  }

  public async disconnect(): Promise<void> {
    if (this.session) {
      await this.signer.disconnect()
    }
    this.reset()
  }

  public on: IEthereumProviderEvents['on'] = (event, listener) => {
    this.events.on(event, listener)
    return this
  }

  public once: IEthereumProviderEvents['once'] = (event, listener) => {
    this.events.once(event, listener)
    return this
  }

  public removeListener: IEthereumProviderEvents['removeListener'] = (event, listener) => {
    this.events.removeListener(event, listener)
    return this
  }

  public off: IEthereumProviderEvents['off'] = (event, listener) => {
    this.events.off(event, listener)
    return this
  }

  // eslint-disable-next-line class-methods-use-this
  get isWalletConnect() {
    return true
  }

  get session() {
    return this.signer.session
  }

  // ---------- Protected --------------------------------------------- //

  protected registerEventListeners() {
    this.signer.on('session_event', (payload: SignClientTypes.EventArguments['session_event']) => {
      const { params } = payload
      const { event } = params
      if (event.name === 'accountsChanged') {
        this.accounts = this.parseAccounts(event.data)
        this.events.emit('accountsChanged', this.accounts)
      } else if (event.name === 'chainChanged') {
        this.setChainId(this.formatChainId(event.data))
      } else {
        this.events.emit(event.name as any, event.data)
      }
      this.events.emit('session_event', payload)
    })

    this.signer.on('chainChanged', (chainId: string) => {
      const chain = parseInt(chainId)
      this.chainId = chain
      this.events.emit('chainChanged', toHexChainId(this.chainId))
      this.persist()
    })

    this.signer.on('session_update', (payload: SignClientTypes.EventArguments['session_update']) => {
      this.events.emit('session_update', payload)
    })

    this.signer.on('session_delete', (payload: SignClientTypes.EventArguments['session_delete']) => {
      this.reset()
      this.events.emit('session_delete', payload)
      this.events.emit('disconnect', {
        ...getSdkError('USER_DISCONNECTED'),
        data: payload.topic,
        name: 'USER_DISCONNECTED',
      })
    })

    this.signer.on('display_uri', (uri: string) => {
      if (this.rpc.showQrModal) {
        // to refresh the QR we have to close the modal and open it again
        // until proper API is provided by walletconnect modal
        this.modal?.closeModal()
        this.modal?.openModal({ uri })
      }
      this.events.emit('display_uri', uri)
    })

    this.pushClient.on('push_response', (event) => {
      this.events.emit('push_response', event)
    })

    this.pushClient.on('push_delete', (event) => {
      this.events.emit('push_delete', event)
    })

    this.authClient.on('auth_response', ({ params, topic }: any) => {
      this.events.emit('auth_response', { params, topic })
      // do more checjing on accounts
      if (this.modal) this.modal.closeModal()
    })
  }

  protected switchEthereumChain(chainId: number): void {
    this.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId.toString(16) }],
    })
  }

  protected isCompatibleChainId(chainId: string): boolean {
    return typeof chainId === 'string' ? chainId.startsWith(`${this.namespace}:`) : false
  }

  protected formatChainId(chainId: number): string {
    return `${this.namespace}:${chainId}`
  }

  // eslint-disable-next-line class-methods-use-this
  protected parseChainId(chainId: string): number {
    return Number(chainId.split(':')[1])
  }

  protected setChainIds(chains: string[]) {
    const compatible = chains.filter((x) => this.isCompatibleChainId(x))
    const chainIds = compatible.map((c) => this.parseChainId(c))
    if (chainIds.length) {
      this.chainId = chainIds[0]
      this.events.emit('chainChanged', toHexChainId(this.chainId))
      this.persist()
    }
  }

  protected setChainId(chain: string) {
    if (this.isCompatibleChainId(chain)) {
      const chainId = this.parseChainId(chain)
      this.chainId = chainId
      this.switchEthereumChain(chainId)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  protected parseAccountId(account: string): { chainId: string; address: string } {
    const [namespace, reference, address] = account.split(':')
    const chainId = `${namespace}:${reference}`
    return { chainId, address }
  }

  protected setAccounts(accounts: string[]) {
    this.accounts = accounts
      .filter((x) => this.parseChainId(this.parseAccountId(x).chainId) === this.chainId)
      .map((x) => this.parseAccountId(x).address)
    this.events.emit('accountsChanged', this.accounts)
  }

  protected getRpcConfig(opts: EthereumProviderOptions): EthereumRpcConfig {
    const requiredChains = opts?.chains ?? []
    const optionalChains = opts?.optionalChains ?? []
    const allChains = requiredChains.concat(optionalChains)
    if (!allChains.length) throw new Error('No chains specified in either `chains` or `optionalChains`')
    const requiredMethods = requiredChains.length ? opts?.methods || REQUIRED_METHODS : []
    const requiredEvents = requiredChains.length ? opts?.events || REQUIRED_EVENTS : []
    const optionalMethods = opts?.optionalMethods || []
    const optionalEvents = opts?.optionalEvents || []
    const rpcMap = opts?.rpcMap || this.buildRpcMap(allChains, opts.projectId)
    const qrModalOptions = opts?.qrModalOptions || undefined
    return {
      chains: requiredChains?.map((chain) => this.formatChainId(chain)),
      optionalChains: optionalChains.map((chain) => this.formatChainId(chain)),
      methods: requiredMethods,
      events: requiredEvents,
      optionalMethods,
      optionalEvents,
      rpcMap,
      showQrModal: Boolean(opts?.showQrModal),
      qrModalOptions,
      projectId: opts.projectId,
      metadata: opts.metadata,
    }
  }

  protected buildRpcMap(chains: number[], projectId: string): EthereumRpcMap {
    const map: EthereumRpcMap = {}
    chains.forEach((chain) => {
      map[chain] = this.getRpcUrl(chain, projectId)
    })
    return map
  }

  protected async initialize(opts: EthereumProviderOptions) {
    this.rpc = this.getRpcConfig(opts)
    this.chainId = this.rpc.chains.length
      ? getEthereumChainId(this.rpc.chains)
      : getEthereumChainId(this.rpc.optionalChains)

    const core = new Core({
      projectId: this.rpc.projectId,
    })
    const customeSignClient = await SignClient.init({
      core,
      projectId: this.rpc.projectId,
      metadata: this.rpc.metadata,
      relayUrl,
      logger: 'debug',
    })
    this.signer = await UniversalProvider.init({
      client: customeSignClient,
      projectId: this.rpc.projectId,
      metadata: this.rpc.metadata,
      disableProviderPing: opts.disableProviderPing,
      relayUrl,
      storageOptions: opts.storageOptions,
    })
    this.pushClient = await DappClient.init({
      core,
      projectId: this.rpc.projectId,
      metadata: this.rpc.metadata,
      relayUrl,
      logger: 'debug',
    })

    this.authClient = await AuthClient.init({
      core,
      projectId: this.rpc.projectId,
      relayUrl,
      metadata: this.rpc.metadata,
    })
    this.registerEventListeners()
    await this.loadPersistedSession()
    if (this.rpc.showQrModal) {
      // @ts-ignore
      let WalletConnectModalClass: typeof Web3Modal | null = null
      try {
        const { Web3Modal } = await import('@web3modal/standalone')
        // @ts-ignore
        WalletConnectModalClass = Web3Modal
      } catch {
        throw new Error('To use QR modal, please install @walletconnect/modal package')
      }
      if (WalletConnectModalClass) {
        try {
          this.modal = new WalletConnectModalClass({
            walletConnectVersion: 2,
            projectId: this.rpc.projectId,
            standaloneChains: this.rpc.chains,
            ...this.rpc.qrModalOptions,
          })
        } catch (e) {
          this.signer.logger.error(e)
          throw new Error('Could not generate WalletConnectModal Instance')
        }
      }
    }
  }

  protected loadConnectOpts(opts?: ConnectOps) {
    if (!opts) return
    const { chains, optionalChains, rpcMap } = opts
    if (chains && isValidArray(chains)) {
      this.rpc.chains = chains.map((chain) => this.formatChainId(chain))
      chains.forEach((chain) => {
        this.rpc.rpcMap[chain] = rpcMap?.[chain] || this.getRpcUrl(chain)
      })
    }
    if (optionalChains && isValidArray(optionalChains)) {
      this.rpc.optionalChains = []
      this.rpc.optionalChains = optionalChains?.map((chain) => this.formatChainId(chain))
      optionalChains.forEach((chain) => {
        this.rpc.rpcMap[chain] = rpcMap?.[chain] || this.getRpcUrl(chain)
      })
    }
  }

  protected getRpcUrl(chainId: number, projectId?: string): string {
    const providedRpc = this.rpc.rpcMap?.[chainId]
    return providedRpc || `${RPC_URL}?chainId=eip155:${chainId}&projectId=${projectId || this.rpc.projectId}`
  }

  protected async loadPersistedSession() {
    if (!this.session) return
    const chainId = await this.signer.client.core.storage.getItem(`${this.STORAGE_KEY}/chainId`)

    // cater to both inline & nested namespace formats
    const namespace = this.session.namespaces[`${this.namespace}:${chainId}`]
      ? this.session.namespaces[`${this.namespace}:${chainId}`]
      : this.session.namespaces[this.namespace]

    this.setChainIds(chainId ? [this.formatChainId(chainId)] : namespace?.accounts)
    this.setAccounts(namespace?.accounts)
  }

  protected reset() {
    this.chainId = 1
    this.accounts = []
  }

  protected persist() {
    if (!this.session) return
    this.signer.client.core.storage.setItem(`${this.STORAGE_KEY}/chainId`, this.chainId)
  }

  protected parseAccounts(payload: string | string[]): string[] {
    if (typeof payload === 'string' || payload instanceof String) {
      return [this.parseAccount(payload)]
    }
    return payload.map((account: string) => this.parseAccount(account))
  }

  protected parseAccount = (payload: any): string => {
    return this.isCompatibleChainId(payload) ? this.parseAccountId(payload).address : payload
  }
}

export default EthereumProvider
