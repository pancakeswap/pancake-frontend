import Metamask from "../../components/Svg/Icons/Metamask";
import WalletConnect from "../../components/Svg/Icons/WalletConnect";
import TrustWallet from "../../components/Svg/Icons/TrustWallet";
import MathWallet from "../../components/Svg/Icons/MathWallet";
import TokenPocket from "../../components/Svg/Icons/TokenPocket";
import BinanceChain from "../../components/Svg/Icons/BinanceChain";
import SafePal from "../../components/Svg/Icons/SafePal";
import Coin98 from "../../components/Svg/Icons/Coin98";
import Blocto from "../../components/Svg/Icons/Blocto";
import CoinbaseWallet from "../../components/Svg/Icons/CoinbaseWallet";

import { Config, ConnectorNames } from "./types";

const connectors: Config[] = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: ConnectorNames.Injected,
    priority: 1,
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: ConnectorNames.WalletConnect,
    priority: 2,
  },
  {
    title: "Trust Wallet",
    icon: TrustWallet,
    connectorId: ConnectorNames.Injected,
    priority: 3,
  },
  {
    title: "MathWallet",
    icon: MathWallet,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: "TokenPocket",
    icon: TokenPocket,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },

  {
    title: "Binance Chain",
    icon: BinanceChain,
    connectorId: ConnectorNames.BSC,
    priority: 999,
  },
  {
    title: "SafePal",
    icon: SafePal,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: "Coin98",
    icon: Coin98,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: "Blocto",
    icon: Blocto,
    connectorId: ConnectorNames.Blocto,
    priority: 999,
  },
  {
    title: "Coinbase",
    icon: CoinbaseWallet,
    connectorId: ConnectorNames.WalletLink,
    priority: 999,
  },
];

export default connectors;
export const connectorLocalStorageKey = "connectorIdv2";
export const walletLocalStorageKey = "wallet";
