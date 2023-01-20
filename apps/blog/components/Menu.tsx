import { Box, Flex, Logo, ThemeSwitcher, Link, Button, LangSelector } from '@pancakeswap/uikit'
import { useTheme as useNextTheme } from 'next-themes'
import NextLink from 'next/link'
import styled from 'styled-components'
import { useTranslation, languageList } from '@pancakeswap/localization'
import { useTheme } from '@pancakeswap/hooks'

const MenuItemStyle = styled.a<any>`
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

const Menu = () => {
  const theme = useTheme()
  const { setTheme } = useNextTheme()
  const { currentLanguage, setLanguage, t } = useTranslation()

  return (
    <Flex height="56px" bg="backgroundAlt" px="16px" alignItems="center" justifyContent="space-between" zIndex={9}>
      <Flex>
        <Logo href="/" />
        <Flex pl={['10px', null, '50px']}>
          <Box display="flex">
            <NextLink href="/blog" passHref>
              <MenuItemStyle $isActive>{t('Blog')}</MenuItemStyle>
            </NextLink>
          </Box>
        </Flex>
      </Flex>
      <Flex alignItems="center">
        <Box mr="16px">
          <ThemeSwitcher isDark={theme.isDark} toggleTheme={() => setTheme(theme.isDark ? 'light' : 'dark')} />
        </Box>
        <LangSelector
          buttonScale="xs"
          color="textSubtle"
          hideLanguage
          currentLang={currentLanguage.code}
          langs={languageList}
          setLang={setLanguage}
        />
        <Link external href="https://pancakeswap.finance/">
          <Button scale="sm">{t('Launch App')}</Button>
        </Link>
      </Flex>
    </Flex>
  )
}

export default Menu
