import React from 'react'
import { useRouter } from 'next/router'
import { useGetCollection } from 'state/nftMarket/hooks'
import Header from '../Header'
import ActivityHistory from '../../ActivityHistory/ActivityHistory'

const Activity = () => {
  const collectionAddress = useRouter().query.collectionAddress as string
  const collection = useGetCollection(collectionAddress)

  return (
    <>
      <Header collection={collection} />
      <ActivityHistory collection={collection} />
    </>
  )
}

export default Activity
