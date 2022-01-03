import React from 'react'
import { useGetCollection } from 'state/nftMarket/hooks'
import Header from '../Header'
import ActivityHistory from '../../ActivityHistory/ActivityHistory'
import { useRouter } from 'next/router'

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
