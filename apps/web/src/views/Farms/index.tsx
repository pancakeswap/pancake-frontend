import { ConnectorNames } from 'config/wallet'
import { ExtendEthereum } from 'global'
import { useAccount, useNetwork } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { FarmsContext, FarmsV3Context } from './context'
import FarmsV3 from './FarmsV3'

export function useIsBloctoETH() {
  const { chain } = useNetwork()
  const { isConnected, connector } = useAccount()
  const isETH = chain?.id === mainnet.id
  return (
    (connector?.id === ConnectorNames.Blocto ||
      (typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto))) &&
    isConnected &&
    isETH
  )
}

export const FarmsV3PageLayout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return <FarmsV3>{children}</FarmsV3>
}

export { FarmsContext, FarmsV3Context }
