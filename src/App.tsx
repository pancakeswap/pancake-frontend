import React, { useEffect } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ResetCSS } from '@pancakeswap-libs/uikit'
import { useFetchPublicData } from 'state/hooks'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import Farms from './views/Farms'
import Farm from './views/Farm'
import Home from './views/Home'
import Stake from './views/Stake'
import Lottery from './views/Lottery'
import Pools from './views/Pools'
import Ifo from './views/Ifo'
import NotFound from './views/NotFound'
import Nft from './views/Nft'
import NftGlobalNotification from './views/Nft/components/NftGlobalNotification'

const App: React.FC = () => {
  const { account, connect } = useWallet()
  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      connect('injected')
    }
  }, [account, connect])

  useFetchPublicData()

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route exact path="/farms">
            <Farms removed={false} />
          </Route>
          <Route path="/farms/:lpSymbol">
            <Farm />
          </Route>
          <Route path="/staking">
            <Stake />
          </Route>
          <Route path="/pools">
            <Pools />
          </Route>
          <Route path="/syrup">
            <Redirect to="/pools" />
          </Route>
          <Route path="/lottery">
            <Lottery />
          </Route>
          <Route path="/removed">
            <Farms removed />
          </Route>
          <Route path="/ifo">
            <Ifo />
          </Route>
          <Route path="/nft">
            <Nft />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Menu>
      <NftGlobalNotification />
    </Router>
  )
}

export default React.memo(App)
