import { useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useGetCollection } from 'state/nftMarket/hooks'
import { useTranslation } from 'contexts/Localization'
import Select, { OptionProps } from 'components/Select/Select'
import Container from 'components/Layout/Container'
import { pancakeBunniesAddress } from '../../constants'
import PancakeBunniesCollectionNfts from './PancakeBunniesCollectionNfts'
import CollectionWrapper from './CollectionWrapper'

const Items = () => {
  const collectionAddress = useRouter().query.collectionAddress as string
  const [sortBy, setSortBy] = useState('updatedAt')
  const { t } = useTranslation()
  const collection = useGetCollection(collectionAddress)
  const isPBCollection = collectionAddress.toLowerCase() === pancakeBunniesAddress.toLowerCase()

  const sortByItems = [
    { label: t('Recently listed'), value: 'updatedAt' },
    { label: t('Lowest price'), value: 'currentAskPrice' },
  ]

  const handleChange = (newOption: OptionProps) => {
    setSortBy(newOption.value)
  }

  return (
    <>
      {isPBCollection ? (
        <Container mb="24px">
          <Flex alignItems="center" justifyContent={['flex-start', null, null, 'flex-end']} mb="24px">
            <Box minWidth="165px">
              <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
                {t('Sort By')}
              </Text>
              <Select options={sortByItems} onOptionChange={handleChange} />
            </Box>
          </Flex>
          <PancakeBunniesCollectionNfts collection={collection} sortBy={sortBy} />
        </Container>
      ) : (
        <CollectionWrapper collection={collection} />
      )}
    </>
  )
}

export default Items
