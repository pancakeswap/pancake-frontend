import { styled } from "styled-components";
import { Flex, FlexProps, Text } from "@pancakeswap/uikit";

export const BaseCell = styled(Flex)<FlexProps>`
  color: black;
  padding: 24px 8px;
  flex-direction: column;
  justify-content: flex-start;
`;

export const CellContent = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  max-height: 40px;
  min-width: 40px;
  ${Text} {
    line-height: 1;
  }
`;
