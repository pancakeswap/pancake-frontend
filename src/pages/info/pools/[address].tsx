import { useRouter } from 'next/router'
import React from 'react'
import { InfoPageLayout } from 'views/Info'
import Pool from 'views/info/Pools/PoolPage'

const PoolPage = () => {
  const router = useRouter()
  return <Pool address={String(router.query.address)} />
}

PoolPage.getLayout = InfoPageLayout

export default PoolPage
