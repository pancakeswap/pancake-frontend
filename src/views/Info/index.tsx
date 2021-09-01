import React from 'react'
import { Route } from 'react-router-dom'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'
import InfoNav from './components/InfoNav'
import Overview from './Overview'
import Pools from './Pools'
import PoolPage from './Pools/PoolPage'
import Tokens from './Tokens'
import RedirectInvalidToken from './Tokens/redirects'

const Info: React.FC = () => {
  return (
    <>
      <ProtocolUpdater />
      <PoolUpdater />
      <TokenUpdater />
      <InfoNav />
      <Route path="/info" exact>
        <Overview />
      </Route>
      <Route path="/info/pools" exact>
        <Pools />
      </Route>
      <Route path="/info/tokens" exact>
        <Tokens />
      </Route>
      <Route exact path={['/info/tokens/:address', '/info/token/:address']} component={RedirectInvalidToken} />
      <Route exact path={['/info/pools/:address', '/info/pool/:address', '/info/pair/:address']} component={PoolPage} />
    </>
  )
}

export default Info
