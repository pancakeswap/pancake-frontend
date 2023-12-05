import styled, { css } from 'styled-components'

export const Row = css`
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: grid;
  grid-template-columns: 3fr repeat(3, 1fr);
  padding: 10px 24px 16px 10px;

  & :nth-child(3) {
    justify-content: center;
  }

  & :nth-child(4) {
    text-align: right;
    justify-content: flex-end;
  }
`

export const THeader = styled.thead`
  ${Row}

  padding: 0;
`

export const TRow = styled.tr`
  ${Row}

  &:first-of-type {
    border-top: none;
  }

  &:last-of-type {
    border-bottom: none;
  }
`
