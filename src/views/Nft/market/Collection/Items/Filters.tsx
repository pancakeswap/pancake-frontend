import React, { useEffect, useState } from 'react'
import { Flex } from '@pancakeswap/uikit'
import capitalize from 'lodash/capitalize'
import { useAppDispatch } from 'state'
import { Collection, NftAttribute } from 'state/nftMarket/types'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { Item, ListFilter } from 'components/Filters'
import { useGetNftFilters } from 'state/nftMarket/hooks'
import { addAttributeFilter, removeAttributeFilter } from 'state/nftMarket/reducer'

interface FiltersProps {
  collection: Collection
}

const Filters: React.FC<FiltersProps> = ({ collection }) => {
  const [attributeDistribution, setAttributeDistribution] = useState({})
  const { address } = collection
  const dispatch = useAppDispatch()

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

  useEffect(() => {
    // @TODO
    // Use the new distribution api
    const fetchDistribution = async () => {
      const response = await getNftsFromCollectionApi(address)
      setAttributeDistribution(response.attributesDistribution)
    }

    fetchDistribution()
  }, [address, setAttributeDistribution])

  return (
    <Flex alignItems="center" flexWrap="wrap">
      {uniqueTraitTypes.map((traitType) => {
        const attrs = attrsByType[traitType]
        const items: Item[] = attrs.map((attr) => ({
          label: capitalize(attr.value as string),
          count: attributeDistribution[traitType] ? attributeDistribution[traitType][attr.value] : undefined,
          attr,
        }))

        // If the attribute has already been selected get it from the current filter list and create an item
        const selectedAttr = nftFilters.attributes[traitType]
        const selectedItem = selectedAttr
          ? {
              label: capitalize(selectedAttr.value as string),
              count: attributeDistribution[traitType]
                ? attributeDistribution[traitType][selectedAttr.value]
                : undefined,
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
  )
}

export default Filters
