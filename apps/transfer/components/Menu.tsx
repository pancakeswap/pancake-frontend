import {
  Button,
  Flex,
  Logo,
  UserMenu,
  UserMenuItem,
  UserMenuDivider,
  Text,
  Box,
  ThemeSwitcher,
} from '@pancakeswap/uikit'
import Image from 'next/future/image'
import NextLink from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useTheme as useNextTheme } from 'next-themes'
import { CHAINS_STARGATE } from '@pancakeswap/wagmi'

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
          <Box display={['none', null, 'flex']}>
            <NextLink href="/" passHref>
              <StyledMenuItem $isActive>Transfer</StyledMenuItem>
            </NextLink>
          </Box>
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
  return (
    <>
      <Box px="16px" py="8px">
        <Text>Select a Network</Text>
      </Box>
      <UserMenuDivider />
      {CHAINS_STARGATE.map((chain) => (
        <UserMenuItem key={chain.id} style={{ justifyContent: 'flex-start' }} onClick={() => switchNetwork(chain.id)}>
          <Image width={24} height={24} src={`/chains/${chain.id}.png`} unoptimized />
          <Text pl="12px">{chain.name}</Text>
        </UserMenuItem>
      ))}
    </>
  )
}

async function switchNetwork(chainId: number) {
  const chain = CHAINS_STARGATE.find((c) => c.id === chainId)
  const provider = window.stargate?.wallet?.ethereum?.signer?.provider?.provider ?? window.ethereum
  if (chain && provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chain.id,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: chain.rpcUrls.default,
                blockExplorerUrls: chain.blockExplorers?.default,
              },
            ],
          })
          return true
        } catch (error) {
          console.error('Failed to setup the network', error)
          return false
        }
      }
      return false
    }
  }
  return false
}

function useStargateReaction<T>(expression: () => T) {
  const savedExpression = useRef(expression)
  const [value, setValue] = useState<T>()

  useEffect(() => {
    savedExpression.current = expression
  }, [expression])

  useEffect(() => {
    customElements.whenDefined('stargate-widget').then(() => {
      window.stargate.utils.reaction(savedExpression.current, (v: T) => {
        setValue(v)
      })
    })
  }, [])

  return value
}

function User() {
  const account = useStargateReaction(() => window.stargate.wallet.ethereum.account)
  const chainId = useStargateReaction(() => window.stargate.wallet.ethereum.chainId)
  const active = useStargateReaction(() => window.stargate.wallet.ethereum.active)

  const chain = CHAINS_STARGATE.find((c) => c.id === chainId)

  const isWrongNetwork = chainId && !chain

  if (isWrongNetwork) {
    return (
      <UserMenu text="Network" variant="danger">
        {() => <UserMenuItems />}
      </UserMenu>
    )
  }

  if (active) {
    return (
      <UserMenu account={account} avatarSrc={chainId ? `/chains/${chainId}.png` : undefined}>
        {() => <UserMenuItems />}
      </UserMenu>
    )
  }

  return (
    <Button scale="sm" onClick={() => window.stargate.ui.connectWalletPopup.open()}>
      <Box display={['none', null, null, 'block']}>Connect Wallet</Box>
      <Box display={['block', null, null, 'none']}>Connect</Box>
    </Button>
  )
}
