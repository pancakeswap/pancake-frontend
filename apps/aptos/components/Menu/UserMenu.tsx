import { useTranslation, Trans } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import {
  Box,
  Flex,
  LogoutIcon,
  RefreshIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  WarningIcon,
} from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { useAccount, useBalance } from '@pancakeswap/aptos'
import { ConnectWalletButton } from '../ConnectWalletButton'
import { useAuth } from '../../hooks/useAuth'
import WalletModal, { WalletView } from './WalletModal'

// import { usePendingTransactions } from 'state/transactions/hooks'
// import WalletModal, { WalletView } from './WalletModal'
// import WalletUserMenuItem from './WalletUserMenuItem'

const isWrongNetwork = false
const hasPendingTransactions = false
const UserMenu = () => {
  const { t } = useTranslation()
  const { account } = useAccount()
  const { logout } = useAuth()
  // const { hasPendingTransactions, pendingNumber } = usePendingTransactions()ail
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')

  const { data } = useBalance({ address: account?.address })
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)

  const hasLowNativeBalance = data?.formatted && Number(data.formatted) >= 0.1
  // useEffect(() => {
  //   if (hasPendingTransactions) {
  //     setUserMenuText(t('%num% Pending', { num: pendingNumber }))
  //     setUserMenuVariable('pending')
  //   } else {
  //     setUserMenuText('')
  //     setUserMenuVariable('default')
  //   }
  // }, [hasPendingTransactions, pendingNumber, t])

  // const onClickWalletMenu = (): void => {
  //   if (isWrongNetwork) {
  //     onPresentWrongNetworkModal()
  //   } else {
  //     onPresentWalletModal()
  //   }
  // }

  const UserMenuItems = () => {
    return (
      <>
        <UserMenuItem as="button" onClick={onPresentWalletModal}>
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {t('Wallet')}
            {hasLowNativeBalance && !isWrongNetwork && <WarningIcon color="warning" width="24px" />}
            {isWrongNetwork && <WarningIcon color="failure" width="24px" />}
          </Flex>
        </UserMenuItem>
        <UserMenuItem
          as="button"
          disabled={isWrongNetwork}
          // onClick={onPresentTransactionModal}
        >
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
    <ConnectWalletButton scale="sm">
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
