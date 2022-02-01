import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import PhishingWarningBanner from 'components/PhishingWarningBanner'
import useTheme from 'hooks/useTheme'
// import { usePriceCakeBusd } from 'state/farms/hooks'
import { usePhishingBannerManager } from 'state/user/hooks'
import useTokenBalance from 'hooks/useTokenBalance'
import tokens from 'config/constants/tokens'
import { getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { getLOTTPriceInUSD } from 'utils/getLOTTPriceInUSD'
import config from './config/config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'


const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const { balance: userCake } = useTokenBalance(tokens.cake.address)
  const userCakeDisplayBalance = getFullDisplayBalance(userCake, 18, 3)
  // const cakePriceUsd = usePriceCakeBusd()

  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()
  const [showPhishingWarningBanner] = usePhishingBannerManager()

  const activeMenuItem = getActiveMenuItem({ menuConfig: config(t), pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const [lottPriceUsd, setLottPriceUsd] = useState(0)
  useEffect(() => {
    (async () => {
      const lottPrice = await getLOTTPriceInUSD()
      setLottPriceUsd(lottPrice)
    })()
  })

  return (
    <UikitMenu
      linkComponent={(linkProps) => {
        return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
      }}
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings />}
      banner={showPhishingWarningBanner && typeof window !== 'undefined' && <PhishingWarningBanner />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={new BigNumber(userCakeDisplayBalance).multipliedBy(lottPriceUsd)}
      links={config(t)}
      subLinks={activeMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
      footerLinks={footerLinks(t)}
      activeItem={activeMenuItem?.href}
      activeSubItem={activeSubMenuItem?.href}
      buyCakeLabel={t('Buy CAKE')}
      {...props}
    />
  )
}

export default Menu
