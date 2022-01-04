import { NoSSRLayout } from 'components/Layout/NoSSRLayout'
import Pools from 'views/Pools'
import React from 'react'

const PoolsPage = () => {
  return <Pools />
}

PoolsPage.getLayout = NoSSRLayout

export default PoolsPage
