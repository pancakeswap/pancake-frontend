import styled from 'styled-components'
import { Text, Flex } from '@pancakeswap/uikit'

export const ClickableColumnHeader = styled(Text)`
  cursor: pointer;
  display: flex;
  justify-content: start;
  gap: 5px;
`

export const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: ${({ theme }) => theme.radii.card};
  }
  overflow: hidden;
`

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

export const Break = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
`
