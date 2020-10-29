/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@pancakeswap-libs/uikit'
import GlobalStyle from './style/Global'
import MobileMenu from './components/MobileMenu'
import TopBar from './components/TopBar'
import useTheme from './hooks/useTheme'
import Farms from './views/Farms'
import Farm from './views/Farm'
import Home from './views/Home'
import Stake from './views/Stake'
import Lottery from './views/Lottery'
import Voting from './views/Voting'
import Syrup2 from './views/CakeStaking'
import Providers from './Providers'

// components
import Web3ReactManager from './components/Web3ReactManager'

const App: React.FC = () => {
  const [isDark, setIsDark] = useTheme()
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false)
  }, [setMobileMenu])

  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true)
  }, [setMobileMenu])

  return (
    <Providers isDark={isDark}>
      <Router>
        <ResetCSS />
        <GlobalStyle />
        <TopBar
          isDark={isDark}
          toogleTheme={setIsDark}
          onPresentMobileMenu={handlePresentMobileMenu}
        />
        <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
        <Web3ReactManager>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route exact path="/farms">
              <Farms removed={false} />
            </Route>
            <Route path="/farms/:farmId">
              <Farm />
            </Route>
            <Route path="/staking">
              <Stake />
            </Route>
            <Route path="/syrup">
              <Syrup2 />
            </Route>
            <Route path="/lottery">
              <Lottery />
            </Route>
            <Route path="/voting">
              <Voting />
            </Route>
            <Route path="/staking2">
              <Syrup2 />
            </Route>
            <Route path="/removed">
              <Farms removed={true} />
            </Route>
          </Switch>
        </Web3ReactManager>
      </Router>
    </Providers>
  )
}

export default React.memo(App)
