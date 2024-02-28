import { Box, DropdownMenu, DropdownMenuItemType, Flex, Logo, ThemeSwitcher } from '@pancakeswap/uikit'
import { useTheme as useNextTheme } from 'next-themes'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { styled, useTheme } from 'styled-components'

const StyledMenuItem = styled('div')<{ $isActive?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.secondary : theme.colors.textSubtle)};
  font-size: 14px;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};

  padding: 0 6px;
  height: 48px;

  &:hover {
    opacity: 0.65;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    padding: 0 16px;
  }
`

const MenuConfig = [
  { title: 'CAKE', href: '/' },
  {
    title: 'EVMs',
    href: '/axelar',
    items: [
      {
        label: 'Axelar',
        href: '/axelar',
      },
      {
        label: 'Stargate',
        href: '/stargate',
      },
      {
        label: 'Wormhole',
        href: '/wormhole',
      },
    ],
  },
  {
    title: 'Aptos',
    href: '/',
    items: [
      {
        label: 'LayerZero',
        href: 'https://theaptosbridge.com/bridge',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: 'Celer cBridge',
        href: 'https://cbridge.celer.network/1/12360001/',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: 'Wormhole',
        href: 'https://www.portalbridge.com/#/transfer',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
    ],
  },
]

export function Menu() {
  const theme = useTheme()
  const { setTheme } = useNextTheme()
  const nextRouter = useRouter()

  return (
    <Flex height="56px" bg="backgroundAlt" px="16px" alignItems="center" justifyContent="space-between" zIndex={9}>
      <Flex>
        <Logo href="https://pancakeswap.finance" />

        <Flex pl={['10px', null, '50px']}>
          {MenuConfig.map((menu) => (
            <Flex key={menu.title}>
              {menu.items ? (
                <DropdownMenu items={menu.items}>
                  <NextLink href={menu.href} passHref>
                    <StyledMenuItem
                      $isActive={menu.items.findIndex((item) => item.href === nextRouter.pathname) !== -1}
                    >
                      {menu.title}
                    </StyledMenuItem>
                  </NextLink>
                </DropdownMenu>
              ) : (
                <Box display="flex">
                  <NextLink href={menu.href} passHref>
                    <StyledMenuItem $isActive={nextRouter.pathname === menu.href}>{menu.title}</StyledMenuItem>
                  </NextLink>
                </Box>
              )}
            </Flex>
          ))}
          <a href="https://pancakeswap.finance/swap" target="_blank" rel="noreferrer noopener">
            <StyledMenuItem>Swap</StyledMenuItem>
          </a>
        </Flex>
      </Flex>
      <Flex alignItems="center">
        <Box mr="16px">
          <ThemeSwitcher isDark={theme.isDark} toggleTheme={() => setTheme(theme.isDark ? 'light' : 'dark')} />
        </Box>
      </Flex>
    </Flex>
  )
}
