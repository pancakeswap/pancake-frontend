import { useModal } from "../Modal";
import ConnectModal from "./ConnectModal";
import { Login, WalletConfig } from "./types";

interface ReturnType {
  onPresentConnectModal: () => void;
}

function useWalletModal<T>(login: Login<T>, t: (key: string) => string, wallets: WalletConfig<T>[]): ReturnType {
  const [onPresentConnectModal] = useModal(<ConnectModal login={login} t={t} wallets={wallets} />);
  return { onPresentConnectModal };
}

export default useWalletModal;
