import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import Container from 'components/Layout/Container'
import { useAppDispatch } from 'state'
import { useGetCollection } from 'state/nftMarket/hooks'
import { fetchCollection } from 'state/nftMarket/reducer'
import Header from '../Header'
import PancakeBunniesTraits from './PancakeBunniesTraits'

const Traits = () => {
  const { collectionAddress } = useParams<{ collectionAddress: string }>()
  const dispatch = useAppDispatch()
  const collection = useGetCollection(collectionAddress)
  const { address } = collection || {}

  useEffect(() => {
    if (address) {
      dispatch(fetchCollection(address))
    }
  }, [address, dispatch])

  return (
    <>
      <Header collection={collection} />
      <Container py="40px">
        <PancakeBunniesTraits collectionAddress={address} />
      </Container>
    </>
  )
}

export default Traits
