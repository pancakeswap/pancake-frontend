import React, { useEffect } from 'react'
import { Flex, Button } from '@pancakeswap/uikit'
import capitalize from 'lodash/capitalize'
import isEmpty from 'lodash/isEmpty'
import { useAppDispatch } from 'state'
import { useGetNftFilters } from 'state/nftMarket/hooks'
import { Collection, NftAttribute } from 'state/nftMarket/types'
import {
  addAttributeFilter,
  fetchNftsFromCollections,
  filterNftsFromCollection,
  removeAllFilters,
  removeAttributeFilter,
} from 'state/nftMarket/reducer'
import { Item, ListFilter } from 'components/Filters'
import { useTranslation } from 'contexts/Localization'
import useGetCollectionDistribution from '../../hooks/useGetCollectionDistribution'

interface FiltersProps {
  collection: Collection
}

const Filters: React.FC<FiltersProps> = ({ collection }) => {
  const { address } = collection
  const { data } = useGetCollectionDistribution(address)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const nftFilters = useGetNftFilters(address)
  const attrsByType: Record<string, NftAttribute[]> = collection?.attributes?.reduce(
    (accum, attr) => ({
      ...accum,
      [attr.traitType]: accum[attr.traitType] ? [...accum[attr.traitType], attr] : [attr],
    }),
    {},
  )
  const uniqueTraitTypes = attrsByType ? Object.keys(attrsByType) : []

  const handleApply = ({ attr }: Item) => {
    dispatch(addAttributeFilter({ collectionAddress: address, attr }))
  }

  const clearAll = () => {
    dispatch(removeAllFilters(address))
    dispatch(fetchNftsFromCollections({ collectionAddress: address, page: 1, size: 100 }))
  }

  useEffect(() => {
    if (nftFilters && !isEmpty(nftFilters.attributes)) {
      dispatch(filterNftsFromCollection({ collectionAddress: address, attrs: nftFilters.attributes }))
    }
  }, [address, nftFilters, dispatch])

  return (
    <Flex alignItems="center" justifyContent="space-between" mb="32px">
      <Flex alignItems="center" flexWrap="wrap" style={{ flex: 1 }}>
        {uniqueTraitTypes.map((traitType) => {
          const attrs = attrsByType[traitType]
          const items: Item[] = attrs.map((attr) => ({
            label: capitalize(attr.value as string),
            count: data && data[traitType] ? data[traitType][attr.value] : undefined,
            attr,
          }))

          // If the attribute has already been selected get it from the current filter list and create an item
          const selectedAttr = nftFilters ? nftFilters.attributes[traitType] : null
          const selectedItem = selectedAttr
            ? {
                label: capitalize(selectedAttr.value as string),
                count: data && data[traitType] ? data[traitType][selectedAttr.value] : undefined,
                attr: selectedAttr,
              }
            : undefined

          const handleClear = () => {
            dispatch(removeAttributeFilter({ collectionAddress: address, traitType }))
          }

          return (
            <ListFilter
              key={traitType}
              title={capitalize(traitType)}
              selectedItem={selectedItem}
              items={items}
              onApply={handleApply}
              onClear={handleClear}
            />
          )
        })}
      </Flex>
      {!isEmpty(nftFilters?.attributes) && (
        <Button key="clear-all" variant="text" scale="sm" onClick={clearAll}>
          {t('Clear All')}
        </Button>
      )}
    </Flex>
  )
}

export default Filters
