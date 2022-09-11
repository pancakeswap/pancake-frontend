import React from "react";
import Button from "../../components/Button/Button";
import Flex from "../../components/Box/Flex";
import useWalletModal from "./useWalletModal";
import { BinanceChainIcon, CoinbaseWalletIcon, MetamaskIcon } from "../../components/Svg";

enum ConnectorNames {
  MetaMask = "metaMask",
  Injected = "injected",
  WalletConnect = "walletConnect",
  BSC = "bsc",
  Blocto = "blocto",
  WalletLink = "coinbaseWallet",
}

export default {
  title: "Widgets/WalletModal",
  argTypes: {},
};

export const Wallet: React.FC<React.PropsWithChildren> = () => {
  const { onPresentConnectModal } = useWalletModal(
    () => null,
    (s) => s,
    [
      {
        title: "Metamask",
        icon: MetamaskIcon,
        installed: typeof window !== "undefined" && Boolean(window.ethereum?.isMetaMask),
        connectorId: ConnectorNames.MetaMask,
        priority: 1,
        href: "https://metamask.app.link/dapp/pancakeswap.finance/",
      },
      {
        title: "Binance Wallet",
        icon: BinanceChainIcon,
        connectorId: ConnectorNames.BSC,
        priority: 2,
      },
      {
        title: "Coinbase Wallet",
        icon: CoinbaseWalletIcon,
        connectorId: ConnectorNames.WalletLink,
        priority: 3,
      },
    ]
  );
  return (
    <Flex>
      <Button onClick={onPresentConnectModal}>Open connect modal</Button>
    </Flex>
  );
};
