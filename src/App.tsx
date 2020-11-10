import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
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
import Providers from './Providers'
import Web3ReactManager from './components/Web3ReactManager'

const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <ResetCSS />
        <GlobalStyle />
        <Menu />
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
              <Farms removed />
            </Route>
          </Switch>
        </Web3ReactManager>
      </Router>
      <Footer />
    </Providers>
  )
}

export default React.memo(App)
