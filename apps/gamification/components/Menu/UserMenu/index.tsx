import { Trans, useTranslation } from '@pancakeswap/localization'
import { Box, Flex, LogoutIcon, UserMenu as UIKitUserMenu, UserMenuItem, useModal } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import WalletModal, { WalletView } from './WalletModal'
import WalletUserMenuItem from './WalletUserMenuItem'

const UserMenuItems = () => {
  const { t } = useTranslation()
  const { isWrongNetwork } = useActiveChainId()
  const { logout } = useAuth()

  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />)

  const onClickWalletMenu = useCallback((): void => {
    if (isWrongNetwork) {
      onPresentWrongNetworkModal()
    } else {
      onPresentWalletModal()
    }
  }, [isWrongNetwork, onPresentWalletModal, onPresentWrongNetworkModal])

  return (
    <>
      <WalletUserMenuItem isWrongNetwork={isWrongNetwork} onPresentWalletModal={onClickWalletMenu} />
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
  const { address: account } = useAccount()
  const { domainName } = useDomainNameForAddress(account)
  const { isWrongNetwork } = useActiveChainId()

  if (account) {
    return (
      <UIKitUserMenu account={domainName || account} ellipsis={!domainName}>
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  if (isWrongNetwork) {
    return (
      <UIKitUserMenu text={t('Network')} variant="danger">
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
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
