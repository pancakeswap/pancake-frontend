import React from 'react'
import { useLocation } from 'react-router'
import { Menu as UikitMenu } from 'peronio-uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
// import PhishingWarningBanner from 'components/PhishingWarningBanner'
import useTheme from 'hooks/useTheme'
// import { usePhishingBannerManager } from 'state/user/hooks'
import { usePePriceArs, usePePriceUsd } from 'hooks/useBUSDPrice'
import useARSPrice from 'hooks/useARSPrice'
import AddToken from 'utils/addToken'
import logo from 'assets/pe.png'
import config from './config/config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const pesosBlueAvg = useARSPrice()
  const pePriceArs = usePePriceArs()
  const pePriceUsdc = usePePriceUsd()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useLocation()
  // const [showPhishingWarningBanner] = usePhishingBannerManager()

  const activeMenuItem = getActiveMenuItem({ menuConfig: config(t), pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings />}
      // banner={showPhishingWarningBanner && <PhishingWarningBanner />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={pePriceArs}
      links={config(t)}
      subLinks={activeMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
      footerLinks={footerLinks(t)}
      activeItem={activeMenuItem?.href}
      activeSubItem={activeSubMenuItem?.href}
      contentTooltip={
        <>
          {pesosBlueAvg && <div>1 ARS = ${(1 / pesosBlueAvg).toFixed(5)} USDC</div>}
          {pePriceArs && <div>1 PE = ${pePriceArs.toFixed(4)} ARS</div>}
          {pePriceUsdc && <div>1 PE = ${pePriceUsdc.toFixed(5)} USDC</div>}
        </>
      }
      onClick={() =>
        AddToken({
          address: '0xc2768beF7a6BB57F0FfA169a9ED4017c09696FF1',
          symbol: 'PE',
          decimals: 6,
          image: logo,
        })
      }
      {...props}
    />
  )
}

export default Menu
