import PageLoader from 'components/Loader/PageLoader'
import dynamic from 'next/dynamic'
import { NextRouter, useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useFetchCollection, useGetCollection } from 'state/nftMarket/hooks'
import Header from './Header'

const Items = dynamic(() => import('./Items'), {
  loading: () => <PageLoader />,
})
const Traits = dynamic(() => import('./Traits'), {
  loading: () => <PageLoader />,
})
const Activity = dynamic(() => import('./Activity'), {
  loading: () => <PageLoader />,
})

const getHashFromRouter = (router: NextRouter) => router.asPath.match(/#([a-z0-9]+)/gi)

const Collection = () => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const collection = useGetCollection(collectionAddress)

  useFetchCollection(collectionAddress)

  const hash = useMemo(() => getHashFromRouter(router)?.[0], [router])

  if (!collection) {
    return <PageLoader />
  }

  if (hash === '#traits') {
    return (
      <>
        <Header collection={collection} />
        <Traits />
      </>
    )
  }

  if (hash === '#activity') {
    return (
      <>
        <Header collection={collection} />
        <Activity />
      </>
    )
  }

  return (
    <>
      <Header collection={collection} />
      <Items />
    </>
  )
}

export default Collection
