import { AtomBox } from '@pancakeswap/uikit'
import { ConnectorNames } from 'config/wallet'
import { ExtendEthereum } from 'global'
import { useAccount, useNetwork } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import FarmsV3 from './FarmsV3'
import { FarmsContext, FarmsV3Context } from './context'

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
  return (
    <AtomBox background="farmPageBackground">
      <FarmsV3>{children}</FarmsV3>
    </AtomBox>
  )
}

export { FarmsContext, FarmsV3Context }
