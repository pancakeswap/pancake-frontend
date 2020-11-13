import React from "react";
import { useModal } from "../Modal";
import ConnectModal from "./ConnectModal";
import AccountModal from "./AccountModal";
import { ConnectCallbackType } from "./types";

interface ReturnType {
  onPresentConnectModal: () => void;
  onPresentAccountModal: () => void;
}

const useWalletModal = (connectCallbacks: ConnectCallbackType[], logout: () => void, account?: string): ReturnType => {
  const [onPresentConnectModal] = useModal(<ConnectModal connectCallbacks={connectCallbacks} />);
  const [onPresentAccountModal] = useModal(<AccountModal account={account} logout={logout} />);
  return { onPresentConnectModal, onPresentAccountModal };
};

export default useWalletModal;
