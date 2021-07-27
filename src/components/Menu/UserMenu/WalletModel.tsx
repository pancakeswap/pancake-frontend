import React from 'react'
import {
  Button,
  CloseIcon,
  Flex,
  Heading,
  IconButton,
  InjectedModalProps,
  LinkExternal,
  ModalBody,
  ModalContainer,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
  Text,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { getBscScanLink } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import useAuth from 'hooks/useAuth'
import { getCakeAddress } from 'utils/addressHelpers'
import CopyAddress from './CopyAddress'

const ModalHeader = styled(UIKitModalHeader)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
`

const WalletModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance } = useGetBnbBalance()
  const { balance: cakeBalance } = useTokenBalance(getCakeAddress())
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss()
    logout()
  }

  return (
    <ModalContainer title={t('Welcome!')} minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Your Wallet')}</Heading>
        </ModalTitle>
        <IconButton variant="text" onClick={onDismiss}>
          <CloseIcon width="24px" color="text" />
        </IconButton>
      </ModalHeader>
      <ModalBody p="24px" maxWidth="400px">
        <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
          {t('Your Address')}
        </Text>
        <CopyAddress account={account} mb="24px" />
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle">{t('BNB Balance')}</Text>
          <Text>{getFullDisplayBalance(balance, 18, 6)}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb="24px">
          <Text color="textSubtle">{t('CAKE Balance')}</Text>
          <Text>{getFullDisplayBalance(cakeBalance, 18, 3)}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="end" mb="24px">
          <LinkExternal href={getBscScanLink(account, 'address')}>{t('View on BscScan')}</LinkExternal>
        </Flex>
        <Button variant="secondary" width="100%" onClick={handleLogout}>
          {t('Disconnect Wallet')}
        </Button>
      </ModalBody>
    </ModalContainer>
  )
}

export default WalletModal
