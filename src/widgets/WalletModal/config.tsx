import Metamask from "./icons/Metamask";
import BinanceChain from "./icons/BinanceChain";
import MathWallet from "./icons/MathWallet";
import TokenPocket from "./icons/TokenPocket";
import TrustWallet from "./icons/TrustWallet";
import WalletConnect from "./icons/WalletConnect";
import { Config } from "./types";

const connectors: Config[] = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: "injected",
  },
  {
    title: "BinanceChain",
    icon: BinanceChain,
    connectorId: "bsc",
  },
  {
    title: "TrustWallet",
    icon: TrustWallet,
    connectorId: "injected",
  },
  {
    title: "MathWallet",
    icon: MathWallet,
    connectorId: "injected",
  },
  {
    title: "TokenPocket",
    icon: TokenPocket,
    connectorId: "injected",
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: "walletconnect",
  },
];

export default connectors;
export const localStorageKey = "accountStatus";
