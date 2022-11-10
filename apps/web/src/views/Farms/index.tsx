import { useTranslation } from '@pancakeswap/localization'
import { Box, Modal, ModalV2 } from '@pancakeswap/uikit'
import { ExtendEthereum } from 'global'
import { FC, useState } from 'react'
import { useFarms } from 'state/farms/hooks'
import { useAccount, useNetwork } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import Farms, { FarmsContext } from './Farms'

// Blocto EVM address is different across chains
function BloctoWarning() {
  const { chain } = useNetwork()
  const { isConnected } = useAccount()
  const { userDataLoaded, data } = useFarms()
  const isETH = chain?.id === mainnet.id
  const hasBloctoAndUserDataLoaded =
    userDataLoaded &&
    typeof window !== 'undefined' &&
    Boolean((window.ethereum as ExtendEthereum)?.isBlocto) &&
    isConnected
  const { t } = useTranslation()

  const [close, setClose] = useState(false)

  const hasBalance =
    hasBloctoAndUserDataLoaded && data.some((f) => f.userData && f.userData.stakedBalance.isGreaterThan(0))

  return (
    <ModalV2 isOpen={hasBloctoAndUserDataLoaded && isETH && !close} closeOnOverlayClick={false}>
      <Modal
        title={t('ETH Farms is not supported on Blocto')}
        onDismiss={() => {
          if (!hasBalance) {
            setClose(true)
          }
        }}
      >
        <Box maxWidth="380px">Dear Blocto users, you shall not pass!</Box>
      </Modal>
    </ModalV2>
  )
}

export const FarmsPageLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <Farms>
      <BloctoWarning />
      {children}
    </Farms>
  )
}

export { FarmsContext }
