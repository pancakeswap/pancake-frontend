import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './theme'
import { UseWalletProvider } from 'use-wallet'
import DisclaimerModal from './components/DisclaimerModal'
import MobileMenu from './components/MobileMenu'
import TopBar from './components/TopBar'
import GlobalStyle from './components/GlobalStyle'
import FarmsProvider from './contexts/Farms'
import ModalsProvider from './contexts/Modals'
import TransactionProvider from './contexts/Transactions'
import SushiProvider from './contexts/SushiProvider'
import BscProvider from './contexts/BscProvider'
import useModal from './hooks/useModal'
import useTheme from './hooks/useTheme'
import Farms from './views/Farms'
import Home from './views/Home'
import Stake from './views/Stake'
import Lottery from './views/Lottery'
import Voting from './views/Voting'
import Vision from './views/Vision'
import Syrup from './views/Syrup'

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
            <Route path="/farms">
              <Farms removed={false}/>
            </Route>
            <Route path="/staking">
              <Stake />
            </Route>
            <Route path="/syrup">
              <Syrup />
            </Route>
            <Route path="/lottery">
              <Lottery />
            </Route>
            <Route path="/voting">
              <Voting />
            </Route>
            <Route path="/removed">
              <Farms removed={true}/>
            </Route>
          </Switch>
        </Web3ReactManager>
      </Router>
      <Disclaimer />
    </Providers>
  )
}

const Providers: React.FC<{ isDark: boolean }> = ({ isDark, children }) => {
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <UseWalletProvider
        chainId={56}
        connectors={{
          walletconnect: { rpcUrl: 'https://bsc-dataseed.binance.org' }
        }}
      >
        <BscProvider>
          <SushiProvider>
            <TransactionProvider>
              <FarmsProvider>
                <ModalsProvider>{children}</ModalsProvider>
              </FarmsProvider>
            </TransactionProvider>
          </SushiProvider>
        </BscProvider>
      </UseWalletProvider>
    </ThemeProvider>
  )
}

const Disclaimer: React.FC = () => {
  const markSeen = useCallback(() => {
    localStorage.setItem('disclaimer', 'seen')
  }, [])

  const [onPresentDisclaimerModal] = useModal(
    <DisclaimerModal onConfirm={markSeen} />,
  )

  useEffect(() => {
    const seenDisclaimer = true // localStorage.getItem('disclaimer')
    if (!seenDisclaimer) {
      onPresentDisclaimerModal()
    }
  }, [])

  return <div />
}

export default React.memo(App)
