import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import useActiveWeb3React from './useActiveWeb3React'

export default function useIsAmbireWC(): boolean {
  const res = useActiveWeb3React()
  const wcConnector = res?.connector as WalletConnectConnector

  return wcConnector?.walletConnectProvider?.wc?._peerMeta?.name === 'Ambire Wallet'
}
