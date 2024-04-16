import { useTranslation } from '@pancakeswap/localization'
import {
  CloseIcon,
  Heading,
  IconButton,
  InjectedModalProps,
  ModalBody,
  ModalTitle,
  ModalWrapper,
  ModalHeader as UIKitModalHeader,
} from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
import { styled } from 'styled-components'
import { parseEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import WalletInfo from './WalletInfo'
import WalletWrongNetwork from './WalletWrongNetwork'

export enum WalletView {
  WALLET_INFO,
  WRONG_NETWORK,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletView
}

export const LOW_NATIVE_BALANCE = parseEther('0.002', 'wei')

const ModalHeader = styled(UIKitModalHeader)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const WalletModal: React.FC<React.PropsWithChildren<WalletModalProps>> = ({
  initialView = WalletView.WALLET_INFO,
  onDismiss,
}) => {
  const [view, setView] = useState(initialView)
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data, isFetched } = useBalance({ address: account })
  const hasLowNativeBalance = Boolean(isFetched && data && data.value <= LOW_NATIVE_BALANCE)

  const handleClick = useCallback((newIndex: number) => {
    setView(newIndex)
  }, [])

  return (
    <ModalWrapper minWidth="360px">
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Your Wallet')}</Heading>
        </ModalTitle>
        <IconButton variant="text" onClick={onDismiss}>
          <CloseIcon width="24px" color="text" />
        </IconButton>
      </ModalHeader>
      <ModalBody p="24px" width="100%">
        {view === WalletView.WALLET_INFO && (
          <WalletInfo hasLowNativeBalance={hasLowNativeBalance} switchView={handleClick} onDismiss={onDismiss} />
        )}
        {view === WalletView.WRONG_NETWORK && !!onDismiss && <WalletWrongNetwork onDismiss={onDismiss} />}
      </ModalBody>
    </ModalWrapper>
  )
}

export default WalletModal
