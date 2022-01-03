import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Container from 'components/Layout/Container'
import { useAppDispatch } from 'state'
import { useGetCollection } from 'state/nftMarket/hooks'
import { fetchCollection } from 'state/nftMarket/reducer'
import Header from '../Header'
import PancakeBunniesTraits from './PancakeBunniesTraits'
import { pancakeBunniesAddress } from '../../constants'
import CollectionTraits from './CollectionTraits'

const Traits = () => {
  const collectionAddress = useRouter().query.collectionAddress as string
  const dispatch = useAppDispatch()
  const collection = useGetCollection(collectionAddress)

  useEffect(() => {
    if (collectionAddress) {
      dispatch(fetchCollection(collectionAddress))
    }
  }, [collectionAddress, dispatch])

  return (
    <>
      <Header collection={collection} />
      <Container py="40px">
        {collectionAddress === pancakeBunniesAddress ? (
          <PancakeBunniesTraits collectionAddress={collectionAddress} />
        ) : (
          <CollectionTraits collectionAddress={collectionAddress} />
        )}
      </Container>
    </>
  )
}

export default Traits
