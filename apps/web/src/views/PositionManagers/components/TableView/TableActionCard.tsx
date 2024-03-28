import { styled } from 'styled-components'

export const TableActionCard = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: left;
  gap: 24px;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: 16px;
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
`
