import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const Container = styled(Flex)`
  padding: 16px;
  align-items: flex-start;
  position: relative;
  gap: 12px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-bottom-width: 2px;
  background: ${({ theme }) => theme.card.background};
  margin: 8px 0;
`
