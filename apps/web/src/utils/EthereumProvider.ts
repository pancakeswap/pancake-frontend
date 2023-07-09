import { EventEmitter } from "events";
import { getAccountsFromNamespaces, getSdkError, isValidArray } from "@walletconnect/utils";
import { Metadata, Namespace, UniversalProvider } from "@walletconnect/universal-provider";
import type { WalletConnectModalConfig, WalletConnectModal } from "@walletconnect/modal";
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import type {Web3Modal} from "@web3modal/standalone"
import AuthClient from "@walletconnect/auth-client";
import WalletConnectCore, { Core } from "@walletconnect/core";
import { DappClient } from "@walletconnect/push-client";
import SignClient from "@walletconnect/sign-client";
import { PROJECT_METADATA } from "views/Notifications/utils/constants";
import { createPushClient, createSignClient } from "views/Notifications/utils/clients";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const relayUrl =
  process.env.NEXT_PUBLIC_RELAY_URL || "wss://relay.walletconnect.com";


// export async function createSignClient() {
//   if (!projectId) {
//     throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
//   }
//   signClient = await SignClient.init({
//     projectId,
//     core,
//     relayUrl,
//     metadata: PROJECT_METADATA,
//   });
// }


// export async function createPushClient() {
//   if (!projectId) {
//     throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
//   }
//   pushClient = await DappClient.init({
//     core,
//     projectId,
//     metadata: PROJECT_METADATA,
//     relayUrl,
//     logger: "debug",
//   });

//   console.log("pushClient", pushClient);
// }

export const PROTOCOL = "wc";
export const WC_VERSION = 2;
export const CONTEXT = "ethereum_provider";
export const STORAGE_KEY = `${PROTOCOL}@${WC_VERSION}:${CONTEXT}:`;
export const RPC_URL = "https://rpc.walletconnect.com/v1/";

export const REQUIRED_METHODS = ["eth_sendTransaction", "personal_sign"];
export const OPTIONAL_METHODS = [
  "eth_accounts",
  "eth_requestAccounts",
  "eth_sendRawTransaction",
  "eth_sign",
  "eth_signTransaction",
  "eth_signTypedData",
  "eth_signTypedData_v3",
  "eth_signTypedData_v4",
  "wallet_switchEthereumChain",
  "wallet_addEthereumChain",
  "wallet_getPermissions",
  "wallet_requestPermissions",
  "wallet_registerOnboarding",
  "wallet_watchAsset",
  "wallet_scanQRCode",
];
export const REQUIRED_EVENTS = ["chainChanged", "accountsChanged"];
export const OPTIONAL_EVENTS = ["message", "disconnect", "connect"];

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface ProviderMessage {
  type: string;
  data: unknown;
}

export interface ProviderInfo {
  chainId: string;
}

export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

export type ProviderChainId = ProviderInfo["chainId"];

export type ProviderAccounts = string[];

export interface EIP1102Request extends RequestArguments {
  method: "eth_requestAccounts";
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace IProviderEvents {
  type Event =
    | "connect"
    | "disconnect"
    | "message"
    | "chainChanged"
    | "accountsChanged"
    | "session_delete"
    | "session_event"
    | "session_update"
    | "display_uri";

  interface EventArguments {
    connect: ProviderInfo;
    disconnect: ProviderRpcError;
    message: ProviderMessage;
    chainChanged: ProviderChainId;
    accountsChanged: ProviderAccounts;
    session_delete: { topic: string };
    session_event: SignClientTypes.EventArguments["session_event"];
    session_update: SignClientTypes.EventArguments["session_delete"];
    display_uri: string;
  }
}
export interface IEthereumProviderEvents {
  on: <E extends IProviderEvents.Event>(
    event: E,
    listener: (args: IProviderEvents.EventArguments[E]) => void,
  ) => EthereumProvider;

  once: <E extends IProviderEvents.Event>(
    event: E,
    listener: (args: IProviderEvents.EventArguments[E]) => void,
  ) => EthereumProvider;

  off: <E extends IProviderEvents.Event>(
    event: E,
    listener: (args: IProviderEvents.EventArguments[E]) => void,
  ) => EthereumProvider;

  removeListener: <E extends IProviderEvents.Event>(
    event: E,
    listener: (args: IProviderEvents.EventArguments[E]) => void,
  ) => EthereumProvider;

  emit: <E extends IProviderEvents.Event>(
    event: E,
    payload: IProviderEvents.EventArguments[E],
  ) => boolean;
}

export interface EIP1193Provider {
  // connection event
  on(event: "connect", listener: (info: ProviderInfo) => void): EthereumProvider;
  // disconnection event
  on(event: "disconnect", listener: (error: ProviderRpcError) => void): EthereumProvider;
  // arbitrary messages
  on(event: "message", listener: (message: ProviderMessage) => void): EthereumProvider;
  // chain changed event
  on(event: "chainChanged", listener: (chainId: ProviderChainId) => void): EthereumProvider;
  // accounts changed event
  on(event: "accountsChanged", listener: (accounts: ProviderAccounts) => void): EthereumProvider;
  // make an Ethereum RPC method call.
  request(args: RequestArguments): Promise<unknown>;
}

// export interface IEthereumProvider extends EIP1193Provider {
//   // legacy alias for EIP-1102
//   enable(): Promise<ProviderAccounts>;
// }

export type QrModalOptions = Pick<
  WalletConnectModalConfig,
  | "themeMode"
  | "themeVariables"
  | "desktopWallets"
  | "enableExplorer"
  | "explorerRecommendedWalletIds"
  | "explorerExcludedWalletIds"
  | "mobileWallets"
  | "privacyPolicyUrl"
  | "termsOfServiceUrl"
  | "walletImages"
>;

export type RpcMethod =
  | "personal_sign"
  | "eth_sendTransaction"
  | "eth_accounts"
  | "eth_requestAccounts"
  | "eth_call"
  | "eth_getBalance"
  | "eth_sendRawTransaction"
  | "eth_sign"
  | "eth_signTransaction"
  | "eth_signTypedData"
  | "eth_signTypedData_v3"
  | "eth_signTypedData_v4"
  | "wallet_switchEthereumChain"
  | "wallet_addEthereumChain"
  | "wallet_getPermissions"
  | "wallet_requestPermissions"
  | "wallet_registerOnboarding"
  | "wallet_watchAsset"
  | "wallet_scanQRCode";

export type RpcEvent = "accountsChanged" | "chainChanged" | "message" | "disconnect" | "connect";

export interface EthereumRpcMap {
  [chainId: string]: string;
}

export interface SessionEvent {
  event: { name: string; data: any };
  chainId: string;
}

export interface EthereumRpcConfig {
  chains: string[];
  optionalChains: string[];
  methods: string[];
  optionalMethods?: string[];
  /**
   * @description Events that the wallet MUST support or the connection will be rejected
   */
  events: string[];
  optionalEvents?: string[];
  rpcMap: EthereumRpcMap;
  projectId: string;
  metadata?: Metadata;
  showQrModal: boolean;
  qrModalOptions?: QrModalOptions;
}
export interface ConnectOps {
  chains?: number[];
  optionalChains?: number[];
  rpcMap?: EthereumRpcMap;
  pairingTopic?: string;
}

export interface IEthereumProvider extends IProvider {
  connect(opts?: ConnectOps | undefined): Promise<void>;
}

export function getRpcUrl(chainId: string, rpc: EthereumRpcConfig): string | undefined {
  let rpcUrl: string | undefined;
  if (rpc.rpcMap) {
    rpcUrl = rpc.rpcMap[getEthereumChainId([chainId])];
  }
  return rpcUrl;
}

export function getEthereumChainId(chains: string[]): number {
  return Number(chains[0].split(":")[1]);
}

export function toHexChainId(chainId: number): string {
  return `0x${chainId.toString(16)}`;
}

export type NamespacesParams = {
  chains: EthereumRpcConfig["chains"];
  optionalChains: EthereumRpcConfig["optionalChains"];
  methods?: EthereumRpcConfig["methods"];
  optionalMethods?: EthereumRpcConfig["methods"];
  events?: EthereumRpcConfig["events"];
  rpcMap: EthereumRpcConfig["rpcMap"];
  optionalEvents?: EthereumRpcConfig["events"];
};

export function buildNamespaces(params: NamespacesParams): {
  required?: Namespace;
  optional?: Namespace;
} {
  const { chains, optionalChains, methods, optionalMethods, events, optionalEvents, rpcMap } =
    params;
  if (!isValidArray(chains)) {
    throw new Error("Invalid chains");
  }

  const required: Namespace = {
    chains,
    methods: methods || REQUIRED_METHODS,
    events: events || REQUIRED_EVENTS,
    rpcMap: {
      ...(chains.length
        ? { [getEthereumChainId(chains)]: rpcMap[getEthereumChainId(chains)] }
        : {}),
    },
  };

  // make a list of events and methods that require additional permissions
  // so we know if we should to include the required chains in the optional namespace
  const eventsRequiringPermissions = events?.filter((event) => !REQUIRED_EVENTS.includes(event));
  const methodsRequiringPermissions = methods?.filter((event) => !REQUIRED_METHODS.includes(event));

  if (
    !optionalChains &&
    !optionalEvents &&
    !optionalMethods &&
    !eventsRequiringPermissions?.length &&
    !methodsRequiringPermissions?.length
  ) {
    return { required: chains.length ? required : undefined };
  }

  /*
   * decides whether or not to include the required chains in the optional namespace
   * use case: if there is a single chain as required but additonal methods/events as optional
   */
  const shouldIncludeRequiredChains =
    (eventsRequiringPermissions?.length && methodsRequiringPermissions?.length) || !optionalChains;

  const optional: Namespace = {
    chains: [
      ...new Set(
        shouldIncludeRequiredChains ? required.chains.concat(optionalChains || []) : optionalChains,
      ),
    ],
    methods: [
      ...new Set(
        required.methods.concat(optionalMethods?.length ? optionalMethods : OPTIONAL_METHODS),
      ),
    ],
    events: [...new Set(required.events.concat(optionalEvents || OPTIONAL_EVENTS))],
    rpcMap,
  };

  return {
    required: chains.length ? required : undefined,
    optional: optionalChains.length ? optional : undefined,
  };
}

// helper type to force setting at least one value in an array
type ArrayOneOrMore<T> = {
  0: T;
} & Array<T>;

/**
 * @param {number[]} chains - The Chains your app intents to use and the peer MUST support. If the peer does not support these chains, the connection will be rejected.
 * @param {number[]} optionalChains - The Chains your app MAY attempt to use and the peer MAY support. If the peer does not support these chains, the connection will still be established.
 * @description either chains or optionalChains must be provided
 */
export type ChainsProps =
  | {
      chains: ArrayOneOrMore<number>;
      optionalChains?: number[];
    }
  | {
      chains?: number[];
      optionalChains: ArrayOneOrMore<number>;
    };

export type EthereumProviderOptions = {
  projectId: string;
  /**
   * @note Methods that your app intents to use and the peer MUST support. If the peer does not support these methods, the connection will be rejected.
   * @default ["eth_sendTransaction", "personal_sign"]
   */
  methods?: string[];
  /**
   * @note Methods that your app MAY attempt to use and the peer MAY support. If the peer does not support these methods, the connection will still be established.
   */
  optionalMethods?: string[];
  events?: string[];
  optionalEvents?: string[];
  rpcMap?: EthereumRpcMap;
  metadata?: Metadata;
  showQrModal: boolean;
  qrModalOptions?: QrModalOptions;
  disableProviderPing?: boolean;
  relayUrl?: string;
  storageOptions?: any;
} & ChainsProps;

export class EthereumProvider implements IEthereumProvider {
  public events = new EventEmitter();

  public namespace = "eip155";

  public accounts: string[] = [];

  public signer: InstanceType<typeof UniversalProvider>;

  public client: SignClient;

  public core: WalletConnectCore;

  public pushClient: DappClient;

  public chainId = 1;

  public modal?: Web3Modal;

  protected rpc: EthereumRpcConfig;

  protected readonly STORAGE_KEY = STORAGE_KEY;

  constructor() {
    // assigned during initialize
    this.signer = {} as InstanceType<typeof UniversalProvider>;
    this.rpc = {} as EthereumRpcConfig;
    this.client = {} as SignClient
    this.core = new Core({
      projectId,
    })
//     this.pushClient = 
  }

  static async init(opts: EthereumProviderOptions): Promise<EthereumProvider> {
    const provider = new EthereumProvider();
    await createSignClient()
    await createPushClient()
    await provider.initialize(opts);
    return provider;
  }

  public async createPushClient() {
      this.pushClient = await DappClient.init({
        core: this.core,
        projectId,
        metadata: PROJECT_METADATA,
        relayUrl,
        logger: "debug",
      });
    
      console.log("pushClient", this.pushClient);
    }

    public async createSignClient() {
      this.client = await SignClient.init({
            projectId,
            core: this.core,
            relayUrl,
            metadata: PROJECT_METADATA,
          });
    
      console.log("pushClient", this.client);
    }
  

  public async request<T = unknown>(args: RequestArguments): Promise<T> {
    return await this.signer.request(args, this.formatChainId(this.chainId));
  }

  public sendAsync(
    args: RequestArguments,
    callback: (error: Error | null, response: any) => void,
  ): void {
    this.signer.sendAsync(args, callback, this.formatChainId(this.chainId));
  }

  get connected(): boolean {
    if (!this.signer.client) return false;
    return this.signer.client.core.relayer.connected;
  }

  get connecting(): boolean {
    if (!this.signer.client) return false;
    return this.signer.client.core.relayer.connecting;
  }

  public async enable(): Promise<ProviderAccounts> {
    if (!this.session) await this.connect();
    const accounts = await this.request({ method: "eth_requestAccounts" });
    return accounts as ProviderAccounts;
  }

  public async connect(opts?: ConnectOps): Promise<void> {
    if (!this.signer.client) {
      throw new Error("Provider not initialized. Call init() first");
    }

    this.loadConnectOpts(opts);
    const { required, optional } = buildNamespaces(this.rpc);
    try {
      const session = await new Promise<SessionTypes.Struct | undefined>(
        async (resolve, reject) => {
          if (this.rpc.showQrModal) {
            this.modal?.subscribeModal((state) => {
              // the modal was closed so reject the promise
              if (!state.open && !this.signer.session) {
                this.signer.abortPairingAttempt();
                reject(new Error("Connection request reset. Please try again."));
              }
            });
          }
          await this.client
            .connect({
                  // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
                  // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
                  requiredNamespaces: {
                    eip155: {
                      methods: [
                        "eth_sendTransaction",
                        "eth_signTransaction",
                        "eth_sign",
                        "personal_sign",
                        "eth_signTypedData",
                      ],
                      chains: ["eip155:1"],
                      events: ["chainChanged", "accountsChanged"],
                    },
                  },
                })
            .then((session) => {
              resolve(session);
            })
            .catch((error: Error) => {
              reject(new Error(error.message));
            });
        },
      );
      if (!session) return;
      this.setChainIds(this.rpc.chains);
      const accounts = getAccountsFromNamespaces(session.namespaces, [this.namespace]);
      this.setAccounts(accounts);
      this.events.emit("connect", { chainId: toHexChainId(this.chainId) });
    } catch (error) {
      this.signer.logger.error(error);
      throw error;
    } finally {
      if (this.modal) this.modal.closeModal();
    }
  }

  public async disconnect(): Promise<void> {
    if (this.session) {
      await this.signer.disconnect();
    }
    this.reset();
  }

  public on: IEthereumProviderEvents["on"] = (event, listener) => {
    this.events.on(event, listener);
    return this;
  };

  public once: IEthereumProviderEvents["once"] = (event, listener) => {
    this.events.once(event, listener);
    return this;
  };

  public removeListener: IEthereumProviderEvents["removeListener"] = (event, listener) => {
    this.events.removeListener(event, listener);
    return this;
  };

  public off: IEthereumProviderEvents["off"] = (event, listener) => {
    this.events.off(event, listener);
    return this;
  };

  // eslint-disable-next-line class-methods-use-this
  get isWalletConnect() {
    return true;
  }

  get session() {
    return this.signer.session;
  }

  // ---------- Protected --------------------------------------------- //

  protected registerEventListeners() {
    this.signer.on("session_event", (payload: SignClientTypes.EventArguments["session_event"]) => {
      const { params } = payload;
      const { event } = params;
      if (event.name === "accountsChanged") {
        this.accounts = this.parseAccounts(event.data);
        this.events.emit("accountsChanged", this.accounts);
      } else if (event.name === "chainChanged") {
        this.setChainId(this.formatChainId(event.data));
      } else {
        this.events.emit(event.name as any, event.data);
      }
      this.events.emit("session_event", payload);
    });

     // Subscribe to session ping
     this.signer.on("session_ping", ({ id, topic }: { id: number; topic: string }) => {
      console.log("EVENT", "session_ping");
      console.log(id, topic);
    });

    this.signer.on("chainChanged", (chainId: string) => {
      const chain = parseInt(chainId);
      this.chainId = chain;
      this.events.emit("chainChanged", toHexChainId(this.chainId));
      this.persist();
    });

    this.signer.on(
      "session_update",
      (payload: SignClientTypes.EventArguments["session_update"]) => {
            console.log('session udated')
        this.events.emit("session_update", payload);
      },
    );

    this.signer.on(
      "session_delete",
      (payload: SignClientTypes.EventArguments["session_delete"]) => {
            console.log('session deleted')

        this.reset();
        this.events.emit("session_delete", payload);
        this.events.emit("disconnect", {
          ...getSdkError("USER_DISCONNECTED"),
          data: payload.topic,
          name: "USER_DISCONNECTED",
        });
      },
    );

    this.signer.on("display_uri", (uri: string) => {
      if (this.rpc.showQrModal) {
        // to refresh the QR we have to close the modal and open it again
        // until proper API is provided by walletconnect modal
        this.modal?.closeModal();
        this.modal?.openModal({ uri });
      }
      this.events.emit("display_uri", uri);
    });
  }

  protected switchEthereumChain(chainId: number): void {
    this.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId.toString(16) }],
    });
  }

  protected isCompatibleChainId(chainId: string): boolean {
    return typeof chainId === "string" ? chainId.startsWith(`${this.namespace}:`) : false;
  }

  protected formatChainId(chainId: number): string {
    return `${this.namespace}:${chainId}`;
  }

  protected parseChainId(chainId: string): number {
    return Number(chainId.split(":")[1]);
  }

  protected setChainIds(chains: string[]) {
    const compatible = chains.filter((x) => this.isCompatibleChainId(x));
    const chainIds = compatible.map((c) => this.parseChainId(c));
    if (chainIds.length) {
      this.chainId = chainIds[0];
      this.events.emit("chainChanged", toHexChainId(this.chainId));
      this.persist();
    }
  }

  protected setChainId(chain: string) {
    if (this.isCompatibleChainId(chain)) {
      const chainId = this.parseChainId(chain);
      this.chainId = chainId;
      this.switchEthereumChain(chainId);
    }
  }

  protected parseAccountId(account: string): { chainId: string; address: string } {
    const [namespace, reference, address] = account.split(":");
    const chainId = `${namespace}:${reference}`;
    return { chainId, address };
  }

  protected setAccounts(accounts: string[]) {
    this.accounts = accounts
      .filter((x) => this.parseChainId(this.parseAccountId(x).chainId) === this.chainId)
      .map((x) => this.parseAccountId(x).address);
    this.events.emit("accountsChanged", this.accounts);
  }

  protected getRpcConfig(opts: EthereumProviderOptions): EthereumRpcConfig {
    const requiredChains = opts?.chains ?? [];
    const optionalChains = opts?.optionalChains ?? [];
    const allChains = requiredChains.concat(optionalChains);
    if (!allChains.length)
      throw new Error("No chains specified in either `chains` or `optionalChains`");
    const requiredMethods = requiredChains.length ? opts?.methods || REQUIRED_METHODS : [];
    const requiredEvents = requiredChains.length ? opts?.events || REQUIRED_EVENTS : [];
    const optionalMethods = opts?.optionalMethods || [];
    const optionalEvents = opts?.optionalEvents || [];
    const rpcMap = opts?.rpcMap || this.buildRpcMap(allChains, opts.projectId);
    const qrModalOptions = opts?.qrModalOptions || undefined;
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
    };
  }

  protected buildRpcMap(chains: number[], projectId: string): EthereumRpcMap {
    const map: EthereumRpcMap = {};
    chains.forEach((chain) => {
      map[chain] = this.getRpcUrl(chain, projectId);
    });
    return map;
  }

  protected async initialize(opts: EthereumProviderOptions) {
    this.rpc = this.getRpcConfig(opts);
    this.chainId = this.rpc.chains.length
      ? getEthereumChainId(this.rpc.chains)
      : getEthereumChainId(this.rpc.optionalChains);
    this.signer = await UniversalProvider.init({
      projectId: this.rpc.projectId,
      metadata: this.rpc.metadata,
      disableProviderPing: opts.disableProviderPing,
      relayUrl: opts.relayUrl,
      storageOptions: opts.storageOptions,
      
    });

    this.client = this.signer.client
    console.log('settttt')


    this.registerEventListeners();
    await this.loadPersistedSession();
    if (this.rpc.showQrModal) {
      let WalletConnectModalClass;
      try {
        const { Web3Modal } = await import("@web3modal/standalone");
        WalletConnectModalClass = Web3Modal;
      } catch {
        throw new Error("To use QR modal, please install @walletconnect/modal package");
      }
      if (WalletConnectModalClass) {
        try {
            this.modal = new WalletConnectModalClass({
                  projectId: this.rpc.projectId,
                  walletConnectVersion: 2,
                });
                console.log('settttt')
        } catch (e) {
          this.signer.logger.error(e);
          throw new Error("Could not generate WalletConnectModal Instance");
        }
      }
    }
  }

  protected loadConnectOpts(opts?: ConnectOps) {
    if (!opts) return;
    const { chains, optionalChains, rpcMap } = opts;
    if (chains && isValidArray(chains)) {
      this.rpc.chains = chains.map((chain) => this.formatChainId(chain));
      chains.forEach((chain) => {
        this.rpc.rpcMap[chain] = rpcMap?.[chain] || this.getRpcUrl(chain);
      });
    }
    if (optionalChains && isValidArray(optionalChains)) {
      this.rpc.optionalChains = [];
      this.rpc.optionalChains = optionalChains?.map((chain) => this.formatChainId(chain));
      optionalChains.forEach((chain) => {
        this.rpc.rpcMap[chain] = rpcMap?.[chain] || this.getRpcUrl(chain);
      });
    }
  }

  protected getRpcUrl(chainId: number, projectId?: string): string {
    const providedRpc = this.rpc.rpcMap?.[chainId];
    return (
      providedRpc ||
      `${RPC_URL}?chainId=eip155:${chainId}&projectId=${projectId || this.rpc.projectId}`
    );
  }

  protected async loadPersistedSession() {
    if (!this.session) return;
    const chainId = await this.signer.client.core.storage.getItem(`${this.STORAGE_KEY}/chainId`);

    // cater to both inline & nested namespace formats
    const namespace = this.session.namespaces[`${this.namespace}:${chainId}`]
      ? this.session.namespaces[`${this.namespace}:${chainId}`]
      : this.session.namespaces[this.namespace];

    this.setChainIds(chainId ? [this.formatChainId(chainId)] : namespace?.accounts);
    this.setAccounts(namespace?.accounts);
  }

  protected reset() {
    this.chainId = 1;
    this.accounts = [];
  }

  protected persist() {
    if (!this.session) return;
    this.signer.client.core.storage.setItem(`${this.STORAGE_KEY}/chainId`, this.chainId);
  }

  protected parseAccounts(payload: string | string[]): string[] {
    if (typeof payload === "string" || payload instanceof String) {
      return [this.parseAccount(payload)];
    }
    return payload.map((account: string) => this.parseAccount(account));
  }

  protected parseAccount = (payload: any): string => {
    return this.isCompatibleChainId(payload) ? this.parseAccountId(payload).address : payload;
  };
}

export default EthereumProvider;