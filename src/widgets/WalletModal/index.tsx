import React from "react";
import { useModal } from "../Modal";
import ConnectModal from "./ConnectModal";
import AccountModal from "./AccountModal";

interface ReturnType {
  onPresentConnectModal: () => void;
  onPresentAccountModal: () => void;
}

const useWalletModal = (login: () => void, logout: () => void, account?: string): ReturnType => {
  const [onPresentConnectModal] = useModal(<ConnectModal login={login} />);
  const [onPresentAccountModal] = useModal(<AccountModal account={account} logout={logout} />);
  return { onPresentConnectModal, onPresentAccountModal };
};

export default useWalletModal;
