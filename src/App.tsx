import React, { useEffect, lazy, useState } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@rug-zombie-libs/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import ToastListener from 'components/ToastListener'
import { routes } from 'routes'
import Menu from 'components/Menu'
import Loader from 'components/Loader'
import Home from 'views/Home/Home'
import Tombs from 'views/Tombs/Tombs'
import Gravedigger from 'views/Gravedigger/'
import { useWeb3React } from '@web3-react/core'
import SpawnWithUs from 'views/SpawnWithUs'
import Catacombs from 'views/Catacombs'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import history from './routerHistory'
import GlobalStyle from './style/Global'
import Graves from './views/Graves'
import * as fetch from './redux/fetch'
import Predictions from './views/Predictions'
import PredictionsHome from './views/PredictionsHome'
import SpawningPools from './views/SpawningPools'
import CollectiblesMain from './views/Collectibles'
import { useMultiCall } from './hooks/useContract'
// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Landing = lazy(() => import('./components/Landing'))

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

  const [isAuthenticated, setAuthenticated] = useState(false)
  const [zombiePrice, setZombiePrice] = useState(0)

  useEffect(() => {
    document.title = 'RugZombie'
  })

  useEagerConnect()
  const multi = useMultiCall()
  const { account } = useWeb3React()
  useEffect(() => {
    fetch.initialData(account, multi, setZombiePrice)
  }, [account, multi])

  const handleAuthentication = () => {
    setAuthenticated(!isAuthenticated)
    history.push(routes.HOME)
  }

  const LandingProps = {
    'handleAuthentication': handleAuthentication,
  }

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <SuspenseWithChunkError fallback={<Loader />}>
        <Switch>
          <Route exact path={routes.LANDING}><Landing {...LandingProps} /></Route>
          <Route exact path={routes.GRAVEDIGGER}><Gravedigger /></Route>
          <Route exact path={routes.SPAWNWITHUS}><SpawnWithUs /></Route>
          <Route exact path={routes.CATACOMBS}><Catacombs /></Route>
          <Menu>
            <Route exact path={routes.HOME}><Home /></Route>
            <Route exact path={routes.GRAVES}><Graves /></Route>
            <Route exact path={routes.TOMBS}><Tombs /></Route>
            <Route exact path={routes.SPAWNING_POOLS}><SpawningPools /></Route>
            <Route exact path={routes.MAUSOLEUM}><PredictionsHome /></Route>
            <Route exact path={routes.AUCTION}><Predictions /></Route>
            <Route exact path={routes.COLLECTABLES}><CollectiblesMain /></Route>
          </Menu>
        </Switch>
      </SuspenseWithChunkError>
      <ToastListener />
    </Router>
  )
}

export default React.memo(App)
