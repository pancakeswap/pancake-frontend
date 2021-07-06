import React, { useEffect, lazy, useState } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@rug-zombie-libs/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { fetchLpReserves, fetchZmbeBnbAddress, getBnbPriceinBusd, useFetchProfile } from 'state/hooks'
import { routes } from 'routes'
import Menu from 'components/Menu'
import Loader from 'components/Loader'
import Home from 'views/Home/Home';
import Tombs from 'views/Tombs/Tombs'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
// import Graves from './views/Graves'
import history from './routerHistory'
import GlobalStyle from './style/Global'
import HomeC from './views/HomeCopy'
import tombs from './views/Tombs/data'
import { getAddress } from './utils/addressHelpers'
import { BIG_ZERO } from './utils/bigNumber'
// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Landing = lazy(() => import('./components/Landing'));

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  // Monkey patch warn() because of web3 flood
  // To be removed when web3 1.3.5 is released
  useEffect(() => {
    console.warn = () => null
  }, [])

  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    document.title = 'RugZombie'
  },
  )
  useEagerConnect()
  // useFetchPublicData()
  useFetchProfile()
  // useFetchPriceList()

  const handleAuthentication = () => {
    setAuthenticated(!isAuthenticated);
    history.push(routes.HOME);
  }

  const LandingProps = {
    "handleAuthentication": handleAuthentication
  }

  const [zombieUsdPrice, setZombieUsdPrice] = useState(0)
  const [zmbeBnbReserves, setZmbeBnbReserves] = useState([BIG_ZERO, BIG_ZERO])
  const zmbeBnbAddress = getAddress(tombs[0].lpAddresses)
    fetchLpReserves(zmbeBnbAddress).then((reserves) => {
      const zombieBnbPrice = reserves[1] / reserves[0]
      getBnbPriceinBusd().then((res) => {
        const bnbPrice = res.data.price
        setZombieUsdPrice(zombieBnbPrice * bnbPrice)
      })
    })

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <SuspenseWithChunkError fallback={<Loader />}>
        <Switch>
          <Route exact path={routes.LANDING}><Landing {...LandingProps} /></Route>
          <Menu zombieUsdPrice={zombieUsdPrice}>
            <Route exact path={routes.HOME}><Home zombieUsdPrice={zombieUsdPrice}/></Route>
            <Route exact path={routes.GRAVES}><HomeC zombieUsdPrice={zombieUsdPrice}/></Route>
            <Route exact path={routes.TOMBS}><Tombs zombieUsdPrice={zombieUsdPrice} /></Route>
          </Menu>
        </Switch>
      </SuspenseWithChunkError>
    </Router>
  )
}

export default React.memo(App)
