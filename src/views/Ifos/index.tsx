import React from 'react'
import { Route, useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Flex } from '@pancakeswap/uikit'
import Container from 'components/layout/Container'
import Hero from './components/Hero'
import CurrentIfo from './CurrentIfo'
import PastIfo from './PastIfo'

const Ifos = () => {
  const { path, url, isExact } = useRouteMatch()

  return (
    <>
      <Hero />
      <Container>
        <Flex justifyContent="center" alignItems="center" mb="32px">
          <ButtonMenu activeIndex={!isExact ? 1 : 0} scale="sm" variant="subtle">
            <ButtonMenuItem as={Link} to={`${url}`}>
              Next IFO
            </ButtonMenuItem>
            <ButtonMenuItem as={Link} to={`${url}/history`}>
              Past IFOs
            </ButtonMenuItem>
          </ButtonMenu>
        </Flex>
        <Route exact path={`${path}`}>
          <CurrentIfo />
        </Route>
        <Route path={`${path}/history`}>
          <PastIfo />
        </Route>
      </Container>
    </>
  )
}

export default Ifos
