import React from 'react'
import { Menu as UikitMenu } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { languageList, Language } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import { usePriceCakeBusd, useProfile } from 'state/hooks'
import config from './config'

const Menu = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const cakePriceUsd = usePriceCakeBusd()
  const { profile } = useProfile()
  const { currentLanguage, setLanguage } = useTranslation()
  const {zombieUsdPrice} = props
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
      cakePriceUsd={zombieUsdPrice}
      links={config}
      profile={{
        username: profile?.username,
        image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
        profileLink: '/home',
        noProfileLink: '/home',
        showPip: !profile?.username,
      }}
      {...props}
    />
  )
}

export default Menu;
