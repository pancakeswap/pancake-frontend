import React from 'react'
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
import WalletModal from './WalletModel'

const UserMenu = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { logout } = useAuth()
  const [onPresentWalletModal] = useModal(<WalletModal />)

  if (!account) {
    return <UnlockButton scale="sm" />
  }

  return (
    <UIKitUserMenu account={account}>
      <UserMenuItem as="button" onClick={onPresentWalletModal}>
        {t('Wallet')}
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
