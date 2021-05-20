import React from 'react'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
// import { Menu as UikitMenu } from '../../pancake-uikit-fork/packages/pancake-uikit/src/widgets/menu'
import { useWeb3React } from '@web3-react/core'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
// import { usePriceCakeBusd, useProfile } from 'state/hooks'
// import { usePriceCakeBusd } from 'state/hooks'
import {config, socials} from './config'

const Menu = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
//  const cakePriceUsd = usePriceCakeBusd()
//  const { profile } = useProfile()
  const { currentLanguage, setLanguage } = useTranslation()

  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={100}
      links={config}
//      profile={{
//        username: profile?.username,
//        image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
//        profileLink: '/profile',
//        noProfileLink: '/profile',
//        showPip: !profile?.username,
//      }}
      {...props}
    />
  )
}

export default Menu
