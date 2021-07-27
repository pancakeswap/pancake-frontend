import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Link } from 'react-router-dom'
import {
  Flex,
  LogoutIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
} from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'
import WalletModal, { WalletView } from './WalletModel'

const UserMenu = () => {
  const [initialView, setInitialView] = useState(WalletView.WALLET_INFO)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { logout } = useAuth()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={initialView} />, true, true, 'wallet_modal')

  const handlePresentWalletModalWallet = () => {
    setInitialView(WalletView.WALLET_INFO)
    onPresentWalletModal()
  }

  const handlePresentWalletModalTransactions = () => {
    setInitialView(WalletView.TRANSACTIONS)
    onPresentWalletModal()
  }

  if (!account) {
    return <UnlockButton scale="sm" />
  }

  return (
    <UIKitUserMenu account={account}>
      <UserMenuItem as="button" onClick={handlePresentWalletModalWallet}>
        {t('Wallet')}
      </UserMenuItem>
      <UserMenuItem as="button" onClick={handlePresentWalletModalTransactions}>
        {t('Transactions')}
      </UserMenuItem>
      <UserMenuDivider />
      <UserMenuItem as={Link} to="/profile">
        {t('Your Profile')}
      </UserMenuItem>
      <UserMenuDivider />
      <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {t('Disconnect')}
          <LogoutIcon />
        </Flex>
      </UserMenuItem>
    </UIKitUserMenu>
  )
}

export default UserMenu
