import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { fetchCollection } from 'state/nftMarket/reducer'
import { useGetCollection } from 'state/nftMarket/hooks'
import { useTranslation } from 'contexts/Localization'
import Select, { OptionProps } from 'components/Select/Select'
import { pancakeBunniesAddress } from '../../constants'
import PancakeBunniesCollectionNfts from './PancakeBunniesCollectionNfts'
import Header from '../Header'
import CollectionWrapper from './CollectionWrapper'

const Items = () => {
  const { collectionAddress } = useParams<{ collectionAddress: string }>()
  const [sortBy, setSortBy] = useState('updatedAt')
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const collection = useGetCollection(collectionAddress)
  const isPBCollection = collectionAddress.toLowerCase() === pancakeBunniesAddress.toLowerCase()

  const { address } = collection || {}

  const sortByItems = [
    { label: t('Recently listed'), value: 'updatedAt' },
    { label: t('Lowest price'), value: 'currentAskPrice' },
  ]

  const handleChange = (newOption: OptionProps) => {
    setSortBy(newOption.value)
  }

  useEffect(() => {
    if (address) {
      dispatch(fetchCollection(address))
    }
  }, [address, dispatch])

  return (
    <>
      <Header collection={collection} />

      {/* Only PBs can return enough data to viably sort the entire collection */}
      {isPBCollection && (
        <Flex alignItems="center" justifyContent={['flex-start', null, null, 'flex-end']} mb="24px">
          <Box minWidth="165px">
            <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
              {t('Sort By')}
            </Text>
            <Select options={sortByItems} onOptionChange={handleChange} />
          </Box>
        </Flex>
      )}
      {isPBCollection ? (
        <PancakeBunniesCollectionNfts collection={collection} sortBy={sortBy} />
      ) : (
        <CollectionWrapper collection={collection} />
      )}
    </>
  )
}

export default Items
