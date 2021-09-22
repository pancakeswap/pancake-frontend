import React from 'react'
import { Menu as UikitMenu } from '@catacombs-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { languageList, Language } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import config from './config'
import { zombiePriceUsd } from '../../../redux/get'

const Menu = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { currentLanguage, setLanguage } = useTranslation()
  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
      isDark={false}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={(langType) => {
        setLanguage(langType as Language)
      }}
      cakePriceUsd={zombiePriceUsd()}
      links={config}
      profile={{
        username: undefined,
        image: '/images/rugZombie/BasicZombie.png',
        profileLink: '/profile',
        noProfileLink: '/profile',
        showPip: undefined,
      }}
      {...props}
    />
  )
}

export default Menu;
