import { Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useCallback } from 'react'

export const useSortFieldClassName = (sortField: string, sortDirection: boolean) =>
  useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? 'is-asc' : 'is-desc'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

export const SortButton = styled(Button)`
  padding: 4px 8px;
  border-radius: 8px;
  width: 25px;
  height: 25px;
  margin-left: 3px;
  border-color: ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => (theme.isDark ? theme.colors.backgroundDisabled : theme.colors.input)};
  path {
    fill: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#B4ACCF')};
  }
  &.is-asc {
    background: ${({ theme }) => (theme.isDark ? theme.colors.input : theme.colors.textSubtle)};
    path:first-child {
      fill: rgba(255, 255, 255, 1);
    }
    path:last-child {
      fill: rgba(255, 255, 255, 0.3);
    }
  }
  &.is-desc {
    background: ${({ theme }) => (theme.isDark ? theme.colors.input : theme.colors.textSubtle)};
    path:first-child {
      fill: rgba(255, 255, 255, 0.3);
    }
    path:last-child {
      fill: rgba(255, 255, 255, 1);
    }
  }
`
