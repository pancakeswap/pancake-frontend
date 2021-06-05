import React, { useEffect, lazy } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@rug-zombie-libs/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { useFetchPriceList, useFetchProfile, useFetchPublicData } from 'state/hooks'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import EasterEgg from './components/EasterEgg'
// import Graves from './views/Graves'
import history from './routerHistory'
import Crypts from './views/Crypts'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
// const Lottery = lazy(() => import('./views/Lottery'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
// const Collectibles = lazy(() => import('./views/Collectibles'))
const Graves = lazy(() => import('./views/Graves'))
const Admin = lazy(() => import('./views/Admin'))
// const Teams = lazy(() => import('./views/Teams'))
// const Team = lazy(() => import('./views/Teams/Team'))
// const Profile = lazy(() => import('./views/Profile'))
// const TradingCompetition = lazy(() => import('./views/TradingCompetition'))
// const Predictions = lazy(() => import('./views/Predictions'))

// This config is required for number formating
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

  useEffect(() => {
      document.title = 'RugZombie'
    },
  )
  useEagerConnect()
  useFetchPublicData()
  useFetchProfile()
  useFetchPriceList()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <img src="https://storage.googleapis.com/rug-zombie/2021-06-05%2014.19.12.jpg" alt="coming soon" style={{
        width: "100%"
      }}/>

      {/* <Menu> */}
        {/* <SuspenseWithChunkError fallback={<PageLoader />}> */}
          {/* <Switch> */}
            {/* <Route path='/' exact> */}
              {/* <Home /> */}
              
            {/* </Route> */}
            {/* <Route path='/admin'> */}
            {/*  <Admin /> */}
            {/* </Route> */}
            {/* <Route path='/tombs'> */}
            {/*  <Farms /> */}
            {/* </Route> */}
            {/* <Route path='/graves'> */}
            {/*  <Graves /> */}
            {/* </Route> */}
            {/* <Route path='/crypts'> */}
            {/*  <Crypts /> */}
            {/* </Route> */}

            {/* <Route path="/lottery"> */}
            {/*  <Lottery /> */}
            {/* </Route> */}
            {/* <Route path="/ifo"> */}
            {/*  <Ifos /> */}
            {/* </Route> */}
            {/* <Route path='/collectibles'> */}
            {/*  <Collectibles /> */}
            {/* </Route> */}
            {/* <Route exact path='/teams'> */}
            {/*  <Teams /> */}
            {/* </Route> */}
            {/* <Route path='/teams/:id'> */}
            {/*  <Team /> */}
            {/* </Route> */}
            {/* <Route path='/profile'> */}
            {/*  <Profile /> */}
            {/* </Route> */}
            {/* <Route path='/competition'> */}
            {/*  <TradingCompetition /> */}
            {/* </Route> */}
            {/* <Route path='/prediction'> */}
            {/*  <Predictions /> */}
            {/* </Route> */}
            {/* Redirect */}

            {/* <Route path='/staking'> */}
            {/*  <Redirect to='/graves' /> */}
            {/* </Route> */}
            {/* <Route path='/pools'> */}
            {/*  <Redirect to='/crypts' /> */}
            {/* </Route> */}
            {/* <Route path='/undead'> */}
            {/*  <Redirect to='/crypts' /> */}
            {/* </Route> */}
            {/* <Route path='/farms'> */}
            {/*  <Redirect to='/tombs' /> */}
            {/* </Route> */}
            {/* <Route path='/nft'> */}
            {/*  <Redirect to='/collectibles' /> */}
            {/* </Route> */}
            {/* 404 */}
            {/* <Route component={NotFound} /> */}
          {/* </Switch> */}
        {/* </SuspenseWithChunkError> */}
      {/* </Menu> */}
      <EasterEgg iterations={2} />
      <ToastListener />
    </Router>
  )
}

export default React.memo(App)
