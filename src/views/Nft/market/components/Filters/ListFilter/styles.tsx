import React from 'react'
import { Radio, Flex, Image, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import noop from 'lodash/noop'
import { formatNumber } from 'utils/formatBalance'
import { Item } from './types'

const StyledItemRow = styled(Flex)`
  cursor: pointer;
  user-select: none;
`

const ItemImage = styled(Image)`
  border-radius: 50%;
`

interface ItemRowProps {
  item: Item
  isSelected: boolean
  onSelect: () => void
}

export const ItemRow: React.FC<ItemRowProps> = ({ item, isSelected, onSelect }) => (
  <StyledItemRow alignItems="center" px="16px" py="8px" onClick={onSelect}>
    {item.image && <ItemImage src={item.image} height={48} width={48} mr="16px" />}
    <Text style={{ flex: 1 }}>{item.label}</Text>
    {item.count !== undefined && (
      <Text color="textSubtle" px="8px">
        {formatNumber(item.count, 0, 0)}
      </Text>
    )}
    <Radio name="item-select" scale="sm" checked={isSelected} value={item.label} onChange={noop} ml="24px" />
  </StyledItemRow>
)

export const SearchWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.dropdown};
  border-radius: 24px 24px 0 0;
`

export const FilterButton = styled(Flex)`
  align-items: center;
  cursor: pointer;
  user-select: none;

  svg {
    pointer-events: none;
  }
`
