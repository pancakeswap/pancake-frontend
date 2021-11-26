import React from 'react'
import { Route } from 'react-router-dom'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'
import InfoNav from './components/InfoNav'
import Overview from './Overview'
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
      <Route path="/info/tokens" exact>
        <Tokens />
      </Route>
      <Route exact path={['/info/tokens/:address', '/info/token/:address']} component={RedirectInvalidToken} />
    </>
  )
}

export default Info
