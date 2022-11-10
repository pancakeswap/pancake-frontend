import { useTranslation } from '@pancakeswap/localization'
import { LinkExternal, ModalV2 } from '@pancakeswap/uikit'
import DisclaimerModal from 'components/DisclaimerModal'
import { ConnectorNames, getDocLink } from 'config/wallet'
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
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()

  const [close, setClose] = useState(false)

  const hasBalance =
    hasBloctoAndUserDataLoaded && data.some((f) => f.userData && f.userData.stakedBalance.isGreaterThan(0))

  return (
    <ModalV2 isOpen={hasBloctoAndUserDataLoaded && isETH && !close} closeOnOverlayClick={false}>
      <DisclaimerModal
        id="blocto-eth"
        modalHeader={t('Unsupported Wallet')}
        header={
          <>
            {t(
              'Crosschain farming on Ethereum does NOT support Blocto wallet, as you won’t be able to harvest CAKE rewards.',
            )}
            <LinkExternal href={getDocLink(code)}>
              {t('Check out our wallet guide for the list of supported wallets.')}
            </LinkExternal>
          </>
        }
        subtitle={t('If you have previously deposited any LP tokens, please unstake.')}
        checks={
          hasBalance
            ? [
                {
                  key: '1',
                  content: t('Understand'),
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
