import { useTranslation } from '@pancakeswap/localization'
import { ModalV2 } from '@pancakeswap/uikit'
import DisclaimerModal from 'components/DisclaimerModal'
import { ConnectorNames } from 'config/wallet'
import { ExtendEthereum } from 'global'
import { FC, useState } from 'react'
import { useFarms } from 'state/farms/hooks'
import { useAccount, useNetwork } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import Farms, { FarmsContext } from './Farms'

// Blocto EVM address is different across chains
function BloctoWarning() {
  const { chain } = useNetwork()
  const { isConnected, connector } = useAccount()
  const { userDataLoaded, data } = useFarms()
  const isETH = chain?.id === mainnet.id
  const hasBloctoAndUserDataLoaded =
    userDataLoaded &&
    (connector?.id === ConnectorNames.Blocto ||
      (typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto))) &&
    isConnected
  const { t } = useTranslation()

  const [close, setClose] = useState(false)

  const hasBalance =
    hasBloctoAndUserDataLoaded && data.some((f) => f.userData && f.userData.stakedBalance.isGreaterThan(0))

  return (
    <ModalV2 isOpen={hasBloctoAndUserDataLoaded && isETH && !close} closeOnOverlayClick={false}>
      <DisclaimerModal
        id="blocto-eth"
        modalHeader={t('Warning')}
        header={t('ETH Farms is not supported on Blocto')}
        checks={
          hasBalance
            ? [
                {
                  key: '1',
                  content: t('Blocto!'),
                },
              ]
            : []
        }
        hideConfirm={!hasBalance}
        onSuccess={() => setClose(false)}
      />
    </ModalV2>
  )
}

export const FarmsPageLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <>
      <BloctoWarning />
      <Farms>{children}</Farms>
    </>
  )
}

export { FarmsContext }
