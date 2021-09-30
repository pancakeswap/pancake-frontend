import React from 'react'
import { Box, BoxProps } from '@pancakeswap/uikit'
import uniqBy from 'lodash/uniqBy'
import { Collection, NftAttribute } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import { MinMaxFilter } from 'components/Filters'
import FilterContainer from '../../components/FilterContainer'

interface FiltersProps extends BoxProps {
  collection: Collection
}

const Filters: React.FC<FiltersProps> = ({ collection, ...props }) => {
  const { t } = useTranslation()

  // @TODO
  // Implement filter logic and remove the log
  const handleMinMaxApply = (min: number, max: number) => {
    console.info(min, max)
  }

  // @TODO
  // Implement filter logic and remove the log
  const handleAttributeClick = (attribute: NftAttribute) => {
    console.info(attribute)
  }

  // Remove duplicate attributes
  const uniqueAttrs = uniqBy(collection.attributes, 'traitType') ?? []

  return (
    <FilterContainer attributes={uniqueAttrs} onAttributeClick={handleAttributeClick} {...props}>
      <Box mb="16px" mr="4px">
        <MinMaxFilter title={t('Price')} onApply={handleMinMaxApply} max={100} />
      </Box>
    </FilterContainer>
  )
}

export default Filters
