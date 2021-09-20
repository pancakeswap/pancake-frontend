import React, { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { useCollectionFromSlug } from 'state/nftMarket/hooks'
import { fetchCollection } from 'state/nftMarket/reducer'
import Page from 'components/Layout/Page'
import Select, { OptionProps } from 'components/Select/Select'
import Header from './Header'
import CollectionNfts from './CollectionNfts'

const Collectible = () => {
  const [sortBy, setSortBy] = useState('updatedAt')
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const collection = useCollectionFromSlug(slug)
  const dispatch = useAppDispatch()
  const { address } = collection || {}

  useEffect(() => {
    if (address) {
      dispatch(fetchCollection(address))
    }
  }, [address, dispatch])

  if (!slug || !collection) {
    return <Redirect to="/404" />
  }

  const sortByItems = [
    { label: t('Recently listed'), value: 'updatedAt' },
    { label: t('Lowest price'), value: 'lowestTokenPrice' },
  ]

  const handleChange = (newOption: OptionProps) => {
    setSortBy(newOption.value)
  }

  return (
    <>
      <Header collection={collection} />
      <Page>
        <Flex alignItems="center" justifyContent={['flex-start', null, null, 'flex-end']} mb="24px">
          <Box>
            <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
              {t('Sort By')}
            </Text>
            <Select options={sortByItems} onOptionChange={handleChange} />
          </Box>
        </Flex>
        <CollectionNfts collection={collection} sortBy={sortBy} />
      </Page>
    </>
  )
}

export default Collectible
