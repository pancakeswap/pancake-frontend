import { SubMenuItems } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useFetchIfoPool, useIfoPool, usePool } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getAprData } from 'views/Pools/helpers'
import Hero from './components/Hero'
import CurrentIfo from './CurrentIfo'
import PastIfo from './PastIfo'

const Ifos = () => {
  const { t } = useTranslation()
  const { path, isExact } = useRouteMatch()

  useFetchIfoPool()

  const { pool } = usePool(0)

  const {
    fees: { performanceFeeAsDecimal },
  } = useIfoPool()

  const ifoPoolWithApr = { ...pool, vaultKey: VaultKey.IfoPool, apr: getAprData(pool, performanceFeeAsDecimal).apr }

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
          <CurrentIfo pool={ifoPoolWithApr} />
        </Route>
        <Route path={`${path}/history`}>
          <PastIfo pool={ifoPoolWithApr} />
        </Route>
      </Container>
    </>
  )
}

export default Ifos
