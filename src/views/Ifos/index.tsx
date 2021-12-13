import { SubMenuItems } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import Container from 'components/Layout/Container'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useFetchIfoPool, useFetchPublicPoolsData, useFetchUserPools } from 'state/pools/hooks'
import Hero from './components/Hero'
import CurrentIfo from './CurrentIfo'
import PastIfo from './PastIfo'

const Ifos = () => {
  const { t } = useTranslation()
  const { path, isExact } = useRouteMatch()
  const { account } = useWeb3React()

  useFetchIfoPool()
  // TODO: should be refactored to only fetch one pool we need
  useFetchPublicPoolsData()
  useFetchUserPools(account)

  return (
    <>
      <SubMenuItems
        items={[
          {
            label: t('Latest'),
            href: '/ifo',
          },
          {
            label: t('Finished'),
            href: '/ifo/history',
          },
        ]}
        activeItem={isExact ? '/ifo' : '/ifo/history'}
      />
      <Hero />
      <Container>
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
