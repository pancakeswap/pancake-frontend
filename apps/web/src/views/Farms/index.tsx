import { useTranslation } from '@pancakeswap/localization'
import { LinkExternal, ModalV2 } from '@pancakeswap/uikit'
import DisclaimerModal from 'components/DisclaimerModal'
import { ConnectorNames, getDocLink } from 'config/wallet'
import { ExtendEthereum } from 'global'
import { FC, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import Farms, { FarmsContext } from './Farms'

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

// Blocto EVM address is different across chains
function BloctoWarning() {
  const isBloctoETH = useIsBloctoETH()
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()

  const [close, setClose] = useState(false)

  return (
    <ModalV2 isOpen={isBloctoETH && !close} closeOnOverlayClick={false}>
      <DisclaimerModal
        id="blocto-eth"
        modalHeader={t('Unsupported Wallet')}
        header={
          <>
            {t(
              'Crosschain farming on Ethereum does NOT support Blocto wallet, as you won’t be able to harvest CAKE rewards.',
            )}
            <LinkExternal href={getDocLink(code)} mt="4px">
              {t('Check out our wallet guide for the list of supported wallets.')}
            </LinkExternal>
          </>
        }
        subtitle={t('If you have previously deposited any LP tokens, please unstake.')}
        checks={[
          {
            key: 'blocto-understand',
            content: t('I understand'),
          },
        ]}
        onSuccess={() => setClose(true)}
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
