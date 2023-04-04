import styled from "styled-components";

export const TwoColumns = styled.div`
  display: grid;
  grid-column-gap: 24px;
  grid-template-columns: 1fr;

  grid-template-rows: max-content;
  grid-auto-flow: row;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 1fr;
  }
`;
