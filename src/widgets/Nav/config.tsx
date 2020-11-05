import Metamask from "./icons/Metamask";
import MathWallet from "./icons/MathWallet";
import TokenPocket from "./icons/TokenPocket";
import TrustWallet from "./icons/TrustWallet";
import WalletConnect from "./icons/WalletConnect";

export default {
  nav: [
    {
      label: "Farm",
      href: "/farm",
    },
    {
      label: "Staking",
      href: "/staking",
    },
    {
      label: "Syrup",
      href: "/syrup",
    },
    {
      label: "Trade",
      href: "https://exchange.pancakeswap.finance/",
    },
    {
      label: "Voting",
      href: "https://voting.pancakeswap.finance/",
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
