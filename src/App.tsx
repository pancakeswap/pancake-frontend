import React, { useEffect } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ResetCSS } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { useFetchPublicData } from 'state/hooks'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import Farms from './views/Farms'
import Farm from './views/Farm'
import Home from './views/Home'
import Lottery from './views/Lottery'
import Pools from './views/Pools'
import Ifos from './views/Ifos'
import NotFound from './views/NotFound'
import Nft from './views/Nft'
import NftGlobalNotification from './views/Nft/components/NftGlobalNotification'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

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
          <Route path="/farms">
            <Farms />
          </Route>
          <Route path="/farm/:lpSymbol">
            <Farm />
          </Route>
          <Route path="/pools">
            <Pools />
          </Route>
          <Route path="/lottery">
            <Lottery />
          </Route>
          <Route path="/ifo">
            <Ifos />
          </Route>
          <Route path="/nft">
            <Nft />
          </Route>
          {/* Redirect */}
          <Route path="/staking">
            <Redirect to="/pools" />
          </Route>
          <Route path="/syrup">
            <Redirect to="/pools" />
          </Route>
          {/* 404 */}
          <Route component={NotFound} />
        </Switch>
      </Menu>
      <NftGlobalNotification />
    </Router>
  )
}

export default React.memo(App)
