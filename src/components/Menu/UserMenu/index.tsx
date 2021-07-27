import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import {
  Flex,
  LogoutIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
} from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useProfile } from 'state/profile/hooks'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'
import WalletModal, { WalletView } from './WalletModal'
import ProfileUserMenuItem from './ProfileUserMenutItem'

const UserMenu = () => {
  const [initialView, setInitialView] = useState(WalletView.WALLET_INFO)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { logout } = useAuth()
  const { isInitialized, isLoading, profile } = useProfile()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={initialView} />, true, true, 'wallet_modal')
  const hasProfile = isInitialized && !!profile

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
      <ProfileUserMenuItem isLoading={isLoading} hasProfile={hasProfile} />
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
