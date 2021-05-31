import styled from "styled-components";
import Grid from "../Box/Grid";

const GridLayout = styled(Grid)`
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 16px;
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 24px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 24px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 32px;
  }
`;

export default GridLayout;
