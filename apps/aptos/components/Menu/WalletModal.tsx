import { parseUnits } from '@ethersproject/units'
import {
  ButtonMenu,
  ButtonMenuItem,
  CloseIcon,
  Heading,
  IconButton,
  InjectedModalProps,
  ModalBody,
  ModalContainer,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
} from '@pancakeswap/uikit'
import { useState } from 'react'
import { useAccount, useAccountBalance, APTOS_COIN } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'

import { LOW_APT } from 'config'
import WalletInfo from './WalletInfo'
import WalletTransactions from './WalletTransactions'

export enum WalletView {
  WALLET_INFO,
  TRANSACTIONS,
  WRONG_NETWORK,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletView
}

export const LOW_BNB_BALANCE = parseUnits('2', 'gwei')

const ModalHeader = styled(UIKitModalHeader)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const Tabs = styled.div`
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 16px 24px;
`

const WalletModal: React.FC<React.PropsWithChildren<WalletModalProps>> = ({
  initialView = WalletView.WALLET_INFO,
  onDismiss,
}) => {
  const [view, setView] = useState(initialView)
  const { t } = useTranslation()
  const { account } = useAccount()
  const { data } = useAccountBalance({ address: account?.address, coin: APTOS_COIN })
  const hasLowNativeBalance = !!data?.formatted && Number(data.formatted) <= LOW_APT

  const handleClick = (newIndex: number) => {
    setView(newIndex)
  }

  const TabsComponent: React.FC<React.PropsWithChildren> = () => (
    <Tabs>
      <ButtonMenu scale="sm" variant="subtle" onItemClick={handleClick} activeIndex={view} fullWidth>
        <ButtonMenuItem>{t('Wallet')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Transactions')}</ButtonMenuItem>
      </ButtonMenu>
    </Tabs>
  )

  return (
    <ModalContainer title={t('Welcome!')} $minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Your Wallet')}</Heading>
        </ModalTitle>
        <IconButton variant="text" onClick={onDismiss}>
          <CloseIcon width="24px" color="text" />
        </IconButton>
      </ModalHeader>
      {view !== WalletView.WRONG_NETWORK && <TabsComponent />}
      <ModalBody p="24px" width="100%">
        {view === WalletView.WALLET_INFO && (
          <WalletInfo hasLowNativeBalance={hasLowNativeBalance} onDismiss={onDismiss} />
        )}
        {view === WalletView.TRANSACTIONS && <WalletTransactions />}
      </ModalBody>
    </ModalContainer>
  )
}

export default WalletModal
