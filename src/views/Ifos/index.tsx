import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'

import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import IfoTabButtons from './components/IfoTabButtons'
import Hero from './components/Hero'
import CurrentIfo from './CurrentIfo'
import PastIfo from './PastIfo'

const Ifos = () => {
  const { path } = useRouteMatch()

  return (
    <Page>
      <Hero />
      <Container>
        <IfoTabButtons />
        <>
          <Route exact path={`${path}`}>
            <CurrentIfo />
          </Route>
          <Route path={`${path}/history`}>
            <PastIfo />
          </Route>
        </>
      </Container>
    </Page>
  )
}

export default Ifos
