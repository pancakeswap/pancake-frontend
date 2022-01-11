import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Container from 'components/Layout/Container'
import { useAppDispatch } from 'state'
import { fetchCollection } from 'state/nftMarket/reducer'
import PancakeBunniesTraits from './PancakeBunniesTraits'
import { pancakeBunniesAddress } from '../../constants'
import CollectionTraits from './CollectionTraits'

const Traits = () => {
  const collectionAddress = useRouter().query.collectionAddress as string
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (collectionAddress) {
      dispatch(fetchCollection(collectionAddress))
    }
  }, [collectionAddress, dispatch])

  return (
    <>
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
