import React, { useEffect, useState } from 'react'
import { Flex } from '@pancakeswap/uikit'
import capitalize from 'lodash/capitalize'
import { Collection, NftAttribute } from 'state/nftMarket/types'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { ListFilter } from 'components/Filters'

interface FiltersProps {
  collection: Collection
}

const Filters: React.FC<FiltersProps> = ({ collection }) => {
  const [attributeDistribution, setAttributeDistribution] = useState({})
  const attrsByType: Record<string, NftAttribute[]> = collection?.attributes?.reduce(
    (accum, attr) => ({
      ...accum,
      [attr.traitType]: accum[attr.traitType] ? [...accum[attr.traitType], attr] : [attr],
    }),
    {},
  )
  const uniqueTraitTypes = attrsByType ? Object.keys(attrsByType) : []
  const { address } = collection

  const handleApplyFilter = (items) => {
    console.log(items)
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
        const items = attrs.map((attr) => ({
          label: capitalize(attr.value as string),
          count: attributeDistribution[traitType] ? attributeDistribution[traitType][attr.value] : undefined,
        }))

        return <ListFilter key={traitType} title={capitalize(traitType)} items={items} onApply={handleApplyFilter} />
      })}
    </Flex>
  )
}

export default Filters
