import { SignClientTypes } from "@walletconnect/types";
// eslint-disable-next-line import/no-cycle
import { EthereumProvider } from "./EthereumProvider2";

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

export interface IEthereumProvider extends EIP1193Provider {
  // legacy alias for EIP-1102
  enable(): Promise<ProviderAccounts>;
}