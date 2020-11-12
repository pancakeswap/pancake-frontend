import React, { useContext, useCallback, useMemo } from 'react'
import { Nav } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import { allLanguages } from 'constants/localisation/languageCodes'
import { LanguageContext } from 'contexts/Localisation/languageContext'
import useTheme from 'hooks/useTheme'
import { useCakePrice } from 'hooks/useTokenBalance'

interface ConnectCallbackType {
  key: 'metamask' | 'trustwallet' | 'mathwallet' | 'tokenpocket' | 'walletconnect'
  callback: () => void
}

const Menu = () => {
  const { account, connect, reset } = useWallet()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = useCakePrice()

  const login = useCallback(
    (connectorId) => {
      connect(connectorId)
      window.localStorage.setItem('accountStatus', '1')
    },
    [connect],
  )

  const logout = useCallback(() => {
    window.localStorage.removeItem('accountStatus')
    reset()
  }, [reset])

  const connectCallbacks: ConnectCallbackType[] = useMemo(
    () => [
      {
        key: 'metamask',
        callback: () => login('injected'),
      },
      {
        key: 'trustwallet',
        callback: () => login('injected'),
      },
      {
        key: 'mathwallet',
        callback: () => login('injected'),
      },
      {
        key: 'tokenpocket',
        callback: () => login('injected'),
      },
      {
        key: 'walletconnect',
        callback: () => login('walletconnect'),
      },
    ],
    [login],
  )

  return (
    <Nav
      account={account}
      connectCallbacks={connectCallbacks}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={cakePriceUsd}
    />
  )
}

export default Menu
