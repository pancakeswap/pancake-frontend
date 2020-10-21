import styled from "styled-components";
import BaseLayout from "./BaseLayout";

const GridLayout = styled(BaseLayout)`
  & > div {
    grid-column: span 6;
    ${({ theme }) => theme.scales.mediaQueries.sm} {
      grid-column: span 4;
    }
  }
`;

export default GridLayout;
