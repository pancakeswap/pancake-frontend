import { AutoColumn } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledLockedCard = styled(AutoColumn)`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`
