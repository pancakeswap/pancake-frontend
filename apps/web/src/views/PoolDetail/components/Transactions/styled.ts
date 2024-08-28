import { Button, Text } from '@pancakeswap/uikit'
import styled, { css } from 'styled-components'
import { SortDirection } from './type'

export const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 2fr 1fr;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1.5fr 1.7fr repeat(2, 1fr);
  }

  padding: 0 24px;
`

export const SortText = styled.button<{ $active: boolean }>`
  cursor: pointer;
  font-weight: 600;
  margin-right: 0.75rem !important;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  padding: 0px;
  color: ${({ $active, theme }) => ($active ? theme.colors.secondary : theme.colors.textSubtle)};
  outline: none;
  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
`

export const ClickableColumnHeader = styled(Text)`
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.75;
`

const AscSortButtonStyle = css`
  background: ${({ theme }) => (theme.isDark ? theme.colors.input : theme.colors.textSubtle)};
  path:first-child {
    fill: rgba(255, 255, 255, 1);
  }
  path:last-child {
    fill: rgba(255, 255, 255, 0.3);
  }
`

const DescSortButtonStyle = css`
  background: ${({ theme }) => (theme.isDark ? theme.colors.input : theme.colors.textSubtle)};
  path:first-child {
    fill: rgba(255, 255, 255, 0.3);
  }
  path:last-child {
    fill: rgba(255, 255, 255, 1);
  }
`

export const SortButton = styled(Button)<{ $direction?: SortDirection }>`
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

  ${({ $direction }) =>
    $direction === SortDirection.Ascending
      ? AscSortButtonStyle
      : $direction === SortDirection.Descending
      ? DescSortButtonStyle
      : ''}
`

export const LastCell = styled.div`
  display: grid;
  & > a {
    grid-row-start: 1;
  }
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: dense;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: unset;
    grid-auto-flow: row;
    justify-content: flex-end;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-rows: 1fr;
    & > a {
      display: none;
    }
  }
`

export const TableHeader = styled(ResponsiveGrid)`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: grid;
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
    padding-bottom: 16px;
  }
`

export const HeadCell = styled.div`
  display: grid;

  & > div {
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      display: flex;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      display: none;
    }
  }
`

export const BodyCell = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: grid;
    grid-auto-rows: auto;
  }
`
