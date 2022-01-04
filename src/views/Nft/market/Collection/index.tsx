import PageLoader from 'components/Loader/PageLoader'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useFetchCollection, useGetCollection } from 'state/nftMarket/hooks'

const Items = dynamic(() => import('./Items'))
const Traits = dynamic(() => import('./Traits'))
const Activity = dynamic(() => import('./Activity'))

function useHandleHashRoute() {
  const [hash, setHash] = useState('')
  const router = useRouter()
  useEffect(() => {
    setHash(window.location.hash || '')

    const onHashChangeStart = () => {
      setHash(window.location.hash || '')
    }

    router.events.on('hashChangeStart', onHashChangeStart)

    return () => {
      router.events.off('hashChangeStart', onHashChangeStart)
    }
  }, [router.events])

  return hash
}

const Collection = () => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const collection = useGetCollection(collectionAddress)

  useFetchCollection(collectionAddress)

  const hash = useHandleHashRoute()

  if (!collection) {
    return <PageLoader />
  }

  if (hash === '#traits') {
    return <Traits />
  }

  if (hash === '#activity') {
    return <Activity />
  }

  return <Items />
}

export default Collection
