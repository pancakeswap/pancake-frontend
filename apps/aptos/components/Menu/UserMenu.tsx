import { useAccount, useAccountBalance, APTOS_COIN } from '@pancakeswap/awgmi'
import { useIsMounted } from '@pancakeswap/hooks'
import { Trans, useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Flex,
  LogoutIcon,
  RefreshIcon,
  Skeleton,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  WarningIcon,
} from '@pancakeswap/uikit'
import { LOW_APT } from 'config'
import { useActiveNetwork } from 'hooks/useNetwork'
import { useEffect, useState } from 'react'
import { usePendingTransactions } from 'state/transactions/hooks'
import { useAuth } from '../../hooks/useAuth'
import { ConnectWalletButton } from '../ConnectWalletButton'
import WalletModal, { WalletView } from './WalletModal'

const UserMenuItems = () => {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const { account } = useAccount()
  const { isWrongNetwork } = useActiveNetwork()
  const { hasPendingTransactions } = usePendingTransactions()
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const { data } = useAccountBalance({ address: account?.address, coin: APTOS_COIN })
  const hasLowNativeBalance = data?.formatted && Number(data.formatted) <= LOW_APT

  return (
    <>
      <UserMenuItem as="button" onClick={onPresentWalletModal}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {t('Wallet')}
          {hasLowNativeBalance && !isWrongNetwork && <WarningIcon color="warning" width="24px" />}
          {isWrongNetwork && <WarningIcon color="failure" width="24px" />}
        </Flex>
      </UserMenuItem>
      <UserMenuItem as="button" disabled={isWrongNetwork} onClick={onPresentTransactionModal}>
        {t('Recent Transactions')}
        {hasPendingTransactions && <RefreshIcon spin />}
      </UserMenuItem>
      <UserMenuDivider />
      <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {t('Disconnect')}
          <LogoutIcon />
        </Flex>
      </UserMenuItem>
    </>
  )
}

const UserMenu = () => {
  const { t } = useTranslation()
  const { account } = useAccount()
  const isMounted = useIsMounted()
  const { isWrongNetwork } = useActiveNetwork()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')

  useEffect(() => {
    if (hasPendingTransactions) {
      setUserMenuText(t('%num% Pending', { num: pendingNumber }))
      setUserMenuVariable('pending')
    } else {
      setUserMenuText('')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber, t])

  if (!isMounted) {
    return <Skeleton height="32px" width="140px" variant="round" />
  }

  if (account) {
    return (
      <UIKitUserMenu account={account?.address} text={userMenuText} variant={userMenuVariable}>
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : <></>)}
      </UIKitUserMenu>
    )
  }

  if (isWrongNetwork) {
    return (
      <UIKitUserMenu text={t('Network')} variant="danger">
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : <></>)}
      </UIKitUserMenu>
    )
  }

  return (
    <ConnectWalletButton scale="sm" width="auto">
      <Box display={['none', null, null, 'block']}>
        <Trans>Connect Wallet</Trans>
      </Box>
      <Box display={['block', null, null, 'none']}>
        <Trans>Connect</Trans>
      </Box>
    </ConnectWalletButton>
  )
}

export default UserMenu
