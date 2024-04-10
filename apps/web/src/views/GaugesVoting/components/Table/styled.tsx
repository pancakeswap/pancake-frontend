import styled, { css } from 'styled-components'

export const Row = css`
  border-top: 0.5px solid ${({ theme }) => theme.colors.cardBorder};
  border-bottom: 0.5px solid ${({ theme }) => theme.colors.cardBorder};
  display: grid;
  grid-template-columns: repeat(3, 2fr) repeat(2, 1fr);
  padding: 10px 16px 10px;
  min-height: 64px;
  transition: all 0.2s ease-in-out;

  & :nth-child(3) {
    display: flex;
    justify-content: flex-start;
  }

  & :nth-child(4),
  & :nth-child(5) {
    text-align: right;
    justify-content: flex-end;
  }

  &:hover {
    backdrop-filter: brightness(95%);
  }
`

export const THeader = styled.thead`
  ${Row}

  padding: 0;
  &:hover {
    backdrop-filter: none;
  }
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

export const VHeader = styled(THeader)`
  grid-template-columns: repeat(2, 1.8fr) repeat(3, 1.5fr);
`

export const VRow = styled(TRow)`
  grid-template-columns: repeat(2, 1.8fr) repeat(3, 1.5fr);
`
