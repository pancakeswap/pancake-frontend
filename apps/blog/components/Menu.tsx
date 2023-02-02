import { Box, Flex, Logo, ThemeSwitcher, Link, Button, LangSelector } from '@pancakeswap/uikit'
import { useTheme as useNextTheme } from 'next-themes'
import { useTranslation, languageList } from '@pancakeswap/localization'
import { useTheme } from '@pancakeswap/hooks'
import NoSSR from 'components/NoSSR'

const Menu = () => {
  const theme = useTheme()
  const { setTheme } = useNextTheme()
  const { currentLanguage, setLanguage, t } = useTranslation()

  return (
    <Flex height="56px" bg="backgroundAlt" px="16px" alignItems="center" justifyContent="space-between" zIndex={9}>
      <Flex>
        <Logo href="/" />
      </Flex>
      <Flex alignItems="center">
        <NoSSR>
          <Box mr="16px">
            <ThemeSwitcher isDark={theme.isDark} toggleTheme={() => setTheme(theme.isDark ? 'light' : 'dark')} />
          </Box>
        </NoSSR>
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
