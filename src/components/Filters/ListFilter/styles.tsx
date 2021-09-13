import React from 'react'
import { Button, Checkbox, Flex, Image, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import noop from 'lodash/noop'
import { formatNumber } from 'utils/formatBalance'

export type Item = {
  label: string
  count: number
  image?: string
  isSelected?: boolean
}

const StyledItemRow = styled(Flex)`
  cursor: pointer;
  user-select: none;
`

const ItemImage = styled(Image)`
  border-radius: 50%;
`

interface ItemRowProps {
  item: Item
  onSelect: () => void
}

export const ItemRow: React.FC<ItemRowProps> = ({ item, onSelect }) => (
  <StyledItemRow alignItems="center" px="16px" py="8px" onClick={onSelect}>
    {item.image && <ItemImage src={item.image} height={48} width={48} mr="16px" />}
    <Text style={{ flex: 1 }}>{item.label}</Text>
    <Text color="textSubtle" mr="4px">
      {formatNumber(item.count, 0, 0)}
    </Text>
    <Checkbox name="item-select" scale="sm" checked={item.isSelected} onChange={noop} />
  </StyledItemRow>
)

export const SearchWrapper = styled(Flex)<{ hasHeader: boolean }>`
  background: ${({ theme }) => theme.colors.dropdown};
  ${({ hasHeader }) =>
    !hasHeader &&
    `
    border-radius: 24px 24px 0 0;
  `}
`

export const SelectAllButton = styled(Button).attrs({ variant: 'text', scale: 'xs' })`
  white-space: nowrap;
`

export const ClearAllButton = styled(SelectAllButton)`
  color: ${({ theme }) => theme.colors.failure};
`
