import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { ResetCSS, Footer } from '@pancakeswap-libs/uikit'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import Farms from './views/Farms'
import Farm from './views/Farm'
import Home from './views/Home'
import Stake from './views/Stake'
import Lottery from './views/Lottery'
import Voting from './views/Voting'
import Syrup2 from './views/CakeStaking'
import ComingSoon from './views/Ifo/ComingSoon'

const App: React.FC = () => {
  const { account, connect } = useWallet()
  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      connect('injected')
    }
  }, [account, connect])

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Menu />
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
          <Farms removed />
        </Route>
        <Route path="/ifo">
          <ComingSoon />
        </Route>
      </Switch>
      <Footer />
    </Router>
  )
}

export default React.memo(App)
