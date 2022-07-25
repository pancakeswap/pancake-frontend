import {
  Button,
  ConnectorNames,
  Flex,
  Logo,
  useWalletModal,
  walletConnectors,
  UserMenu,
  UserMenuItem,
  UserMenuDivider,
  LogoutIcon,
  Text,
  Box,
  ThemeSwitcher,
} from '@pancakeswap/uikit'
import Image from 'next/future/image'
import NextLink from 'next/link'
import { useCallback } from 'react'
import styled, { useTheme } from 'styled-components'
import { useTheme as useNextTheme } from 'next-themes'
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'

const SUPPORTED_CONNECTORS = walletConnectors.filter(
  (c) => c.connectorId !== ConnectorNames.BSC && c.connectorId !== ConnectorNames.Blocto,
)

function useAuth() {
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const login = (connectorId: ConnectorNames) => {
    const findConnector = connectors.find((c) => c.id.toLowerCase() === connectorId.toLowerCase())
    connect({ connector: findConnector })
  }

  const logout = () => {
    disconnect()
  }

  return {
    login,
    logout,
  }
}

const StyledMenuItem = styled.a<any>`
  position: relative;
  display: flex;
  align-items: center;

  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.secondary : theme.colors.textSubtle)};
  font-size: 16px;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};

  padding: 0 16px;
  height: 48px;

  &:hover {
    opacity: 0.65;
  }
`

export function Menu() {
  const theme = useTheme()
  const { setTheme } = useNextTheme()

  return (
    <Flex height="56px" bg="backgroundAlt" px="16px" alignItems="center" justifyContent="space-between" zIndex={1}>
      <Flex>
        <Logo isDark={theme.isDark} href="https://pancakeswap.finance" />

        <Flex pl={['25px', null, '50px']}>
          <NextLink href="/" passHref>
            <StyledMenuItem $isActive>Transfer</StyledMenuItem>
          </NextLink>
          <StyledMenuItem href="https://pancakeswap.finance/swap">Swap</StyledMenuItem>
        </Flex>
      </Flex>
      <Flex alignItems="center">
        <Box mr="16px">
          <ThemeSwitcher isDark={theme.isDark} toggleTheme={() => setTheme(theme.isDark ? 'light' : 'dark')} />
        </Box>
        <User />
      </Flex>
    </Flex>
  )
}

const UserMenuItems = () => {
  const t = (s: string) => s
  const { logout } = useAuth()

  const { chains, switchNetwork } = useSwitchNetwork()

  return (
    <>
      <Box px="16px" py="8px">
        <Text>Select a Network</Text>
      </Box>
      <UserMenuDivider />
      {chains.map((chain) => (
        <UserMenuItem key={chain.id} style={{ justifyContent: 'flex-start' }} onClick={() => switchNetwork?.(chain.id)}>
          <Image width={24} height={24} src={`/chains/${chain.id}.png`} unoptimized />
          <Text pl="12px">{chain.name}</Text>
        </UserMenuItem>
      ))}
      <UserMenuDivider />
      <UserMenuItem as="button" onClick={logout}>
        <Flex color="text" alignItems="center" justifyContent="space-between" width="100%">
          {t('Disconnect')}
          <LogoutIcon />
        </Flex>
      </UserMenuItem>
    </>
  )
}

function User() {
  const { login } = useAuth()
  const { onPresentConnectModal } = useWalletModal(
    login,
    useCallback((s) => s, []),
    SUPPORTED_CONNECTORS,
  )
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const isWrongNetwork = chain?.unsupported

  if (isWrongNetwork) {
    return (
      <UserMenu text="Network" variant="danger">
        {() => <UserMenuItems />}
      </UserMenu>
    )
  }

  if (isConnected) {
    return (
      <UserMenu account={address} avatarSrc={chain ? `/chains/${chain.id}.png` : undefined}>
        {() => <UserMenuItems />}
      </UserMenu>
    )
  }

  return (
    <Button scale="sm" onClick={onPresentConnectModal}>
      <Box display={['none', null, null, 'block']}>Connect Wallet</Box>
      <Box display={['block', null, null, 'none']}>Connect</Box>
    </Button>
  )
}
