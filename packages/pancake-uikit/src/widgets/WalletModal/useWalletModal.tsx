import React from "react";
import { useModal } from "../Modal";
import ConnectModal from "./ConnectModal";
import { Login } from "./types";

interface ReturnType {
  onPresentConnectModal: () => void;
}

const useWalletModal = (login: Login, logout: () => void, t: (key: string) => string): ReturnType => {
  const [onPresentConnectModal] = useModal(<ConnectModal login={login} t={t} />);
  return { onPresentConnectModal };
};

export default useWalletModal;
