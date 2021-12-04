import React from 'react'
import { useParams } from 'react-router'
import { useGetCollection } from 'state/nftMarket/hooks'
import Header from '../Header'
import ActivityHistory from '../../ActivityHistory/ActivityHistory'

const Activity = () => {
  const { collectionAddress } = useParams<{ collectionAddress: string }>()
  const collection = useGetCollection(collectionAddress)

  return (
    <>
      <Header collection={collection} />
      <ActivityHistory collection={collection} />
    </>
  )
}

export default Activity
