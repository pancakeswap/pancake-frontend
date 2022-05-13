import { Flex, Image, Button, IconButton } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledItemRow = styled(Flex)`
  cursor: pointer;
  user-select: none;
`

export const ItemImage = styled(Image)`
  border-radius: 50%;
`

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

export interface ListOrderState {
  orderKey: string
  orderDir: 'asc' | 'desc'
}

export const TriggerButton = styled(Button)<{ hasItem: boolean }>`
  white-space: nowrap;
  ${({ hasItem }) =>
    hasItem &&
    `  
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 8px;
  `}
`

export const CloseButton = styled(IconButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`
