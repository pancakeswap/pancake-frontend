import React from "react";
import { useModal } from "../Modal";
import ConnectModal from "./ConnectModal";
import { Config, Login } from "./types";

interface ReturnType {
  onPresentConnectModal: () => void;
}

const useWalletModal = (login: Login, t: (key: string) => string, connectors?: Config[]): ReturnType => {
  const [onPresentConnectModal] = useModal(<ConnectModal login={login} t={t} connectors={connectors} />);
  return { onPresentConnectModal };
};

export default useWalletModal;
