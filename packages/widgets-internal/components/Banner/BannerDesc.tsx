import { Text } from "@pancakeswap/uikit";
import styled from "styled-components";

export const BannerDesc = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  line-height: 120%;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    white-space: nowrap;
  }
`;
