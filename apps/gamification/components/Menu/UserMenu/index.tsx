import { Trans, useTranslation } from '@pancakeswap/localization'
import { Box, Flex, LogoutIcon, UserMenu as UIKitUserMenu, UserMenuItem, useModal } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { useProfile } from 'hooks/useProfile'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import ProfileUserMenuItem from './ProfileUserMenuItem'
import WalletModal, { WalletView } from './WalletModal'
import WalletUserMenuItem from './WalletUserMenuItem'

const UserMenuItems = () => {
  const { t } = useTranslation()
  const { isWrongNetwork } = useActiveChainId()
  const { logout } = useAuth()
  const { isInitialized, isLoading, profile } = useProfile()

  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />)

  const hasProfile = isInitialized && !!profile

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
      <ProfileUserMenuItem isLoading={isLoading} hasProfile={hasProfile} disabled={isWrongNetwork} />
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
  const { domainName, avatar } = useDomainNameForAddress(account)
  const { isWrongNetwork } = useActiveChainId()
  const { profile } = useProfile()

  const avatarSrc = profile?.nft?.image?.thumbnail ?? avatar

  if (account) {
    return (
      <UIKitUserMenu account={domainName || account} ellipsis={!domainName} avatarSrc={avatarSrc}>
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
