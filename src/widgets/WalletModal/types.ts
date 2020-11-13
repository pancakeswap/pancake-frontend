export interface ConnectCallbackType {
  key: "metamask" | "trustwallet" | "mathwallet" | "tokenpocket" | "walletconnect";
  callback: () => void;
}
