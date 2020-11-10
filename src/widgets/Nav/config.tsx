import Metamask from "./icons/Metamask";
import MathWallet from "./icons/MathWallet";
import TokenPocket from "./icons/TokenPocket";
import TrustWallet from "./icons/TrustWallet";
import WalletConnect from "./icons/WalletConnect";

export default {
  nav: [
    {
      label: "Exchange",
      href: "https://exchange.pancakeswap.finance",
    },
    {
      label: "Liquidity",
      href: "https://exchange.pancakeswap.finance/#/pool",
    },
    {
      label: "Farms",
      href: "/farms",
    },
    {
      label: "Pools",
      href: "/syrup",
    },
    {
      label: "Lottery",
      href: "/lottery",
    },
  ],
  wallets: {
    metamask: {
      title: "Metamask",
      icon: Metamask,
    },
    trustwallet: {
      title: "TrustWallet",
      icon: TrustWallet,
    },
    mathwallet: {
      title: "MathWallet",
      icon: MathWallet,
    },
    tokenpocket: {
      title: "TokenPocket",
      icon: TokenPocket,
    },
    walletconnect: {
      title: "WalletConnect",
      icon: WalletConnect,
    },
  },
};
