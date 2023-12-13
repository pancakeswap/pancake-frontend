import { useTheme as useNextTheme } from 'next-themes'
import {
  Box,
  Flex,
  Logo,
  ThemeSwitcher,
  Link,
  Button,
  LangSelector,
  DropdownMenuItemType,
  DropdownMenu,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useTranslation, languageList, Trans } from '@pancakeswap/localization'
import { styled, useTheme } from 'styled-components'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

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

interface MenuConfigItemType {
  label: string | React.ReactNode
  href: string
  type?: DropdownMenuItemType
}

interface MenuConfigType {
  title: string | React.ReactNode
  href: string
  items?: MenuConfigItemType[]
}

const MenuConfig: MenuConfigType[] = [
  { title: <Trans>Games</Trans>, href: '/' },
  { title: <Trans>Developers</Trans>, href: '/developers' },
  { title: <Trans>Community</Trans>, href: '/community' },
]

const Menu = () => {
  const theme = useTheme()
  const { setTheme } = useNextTheme()
  const nextRouter = useRouter()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <Flex height="56px" bg="backgroundAlt" px="16px" alignItems="center" justifyContent="space-between" zIndex={9}>
      <Flex>
        <Logo href="/" />
        {isDesktop && (
          <Flex pl={['10px', '10px', '10px', '50px']}>
            {MenuConfig.map((menu) => (
              <Flex key={menu.href}>
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
          </Flex>
        )}
      </Flex>
      <Flex alignItems="center">
        <Box mt="6px">
          <LangSelector
            buttonScale="xs"
            color="textSubtle"
            hideLanguage
            currentLang={currentLanguage.code}
            langs={languageList}
            setLang={setLanguage}
          />
        </Box>
        <Box mr="16px">
          <ThemeSwitcher isDark={theme.isDark} toggleTheme={() => setTheme(theme.isDark ? 'light' : 'dark')} />
        </Box>
        <Link external href="https://pancakeswap.finance/">
          <Button scale="sm">{t('Launch App')}</Button>
        </Link>
      </Flex>
    </Flex>
  )
}

export default Menu
