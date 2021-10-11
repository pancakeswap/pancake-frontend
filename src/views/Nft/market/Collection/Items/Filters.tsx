import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import capitalize from 'lodash/capitalize'
import isEmpty from 'lodash/isEmpty'
import { useAppDispatch } from 'state'
import { useGetNftFilters } from 'state/nftMarket/hooks'
import { Collection, NftAttribute } from 'state/nftMarket/types'
import { filterNftsFromCollection, removeAttributeFilter } from 'state/nftMarket/reducer'
import { Item, ListFilter } from 'views/Nft/market/components/Filters'
import useGetCollectionDistribution from '../../hooks/useGetCollectionDistribution'
import ClearAllButton from './ClearAllButton'

interface FiltersProps {
  collection: Collection
}

const ScrollableFlexContainer = styled(Flex)`
  align-items: center;
  flex: 1;
  flex-wrap: nowrap;
  margin-bottom: 32px;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: wrap;
    overflow-x: revert;
  }
`

const Filters: React.FC<FiltersProps> = ({ collection }) => {
  const { address } = collection
  const { data } = useGetCollectionDistribution(address)
  const dispatch = useAppDispatch()

  const nftFilters = useGetNftFilters()
  const attrsByType: Record<string, NftAttribute[]> = collection?.attributes?.reduce(
    (accum, attr) => ({
      ...accum,
      [attr.traitType]: accum[attr.traitType] ? [...accum[attr.traitType], attr] : [attr],
    }),
    {},
  )
  const uniqueTraitTypes = attrsByType ? Object.keys(attrsByType) : []

  const handleApply = ({ attr }: Item) => {
    dispatch(
      filterNftsFromCollection({
        collectionAddress: address,
        nftFilters: { ...nftFilters, [attr.traitType]: attr },
      }),
    )
  }

  return (
    <ScrollableFlexContainer>
      {uniqueTraitTypes.map((traitType) => {
        const attrs = attrsByType[traitType]
        const items: Item[] = attrs.map((attr) => ({
          label: capitalize(attr.value as string),
          count: data && data[traitType] ? data[traitType][attr.value] : undefined,
          attr,
        }))

        // If the attribute has already been selected get it from the current filter list and create an item
        const selectedAttr = nftFilters ? nftFilters[traitType] : null
        const selectedItem = selectedAttr
          ? {
              label: capitalize(selectedAttr.value as string),
              count: data && data[traitType] ? data[traitType][selectedAttr.value] : undefined,
              attr: selectedAttr,
            }
          : undefined

        const handleClear = () => {
          dispatch(removeAttributeFilter(traitType))
        }

        return (
          <ListFilter
            key={traitType}
            title={capitalize(traitType)}
            selectedItem={selectedItem}
            items={items}
            collectionAddress={address}
            onApply={handleApply}
            onClear={handleClear}
          />
        )
      })}
      {!isEmpty(nftFilters) && <ClearAllButton collectionAddress={address} mb="4px" />}
    </ScrollableFlexContainer>
  )
}

export default Filters
