import styled from "styled-components";
import { Flex, Box } from "../Box";

const StyledSubMenuItems = styled(Flex)<{ $isMobileOnly: boolean }>`
  width: 100%;
  display: block;
  white-space: nowrap;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  ${({ theme }) => theme.mediaQueries.sm} {
    ${({ $isMobileOnly }) => ($isMobileOnly ? "display:none" : "")};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
    display: flex;
  }
  flex-grow: 1;
  background-color: ${({ theme }) => `${theme.colors.backgroundAlt2}`};
  box-shadow: inset 0px -2px 0px -8px rgba(133, 133, 133, 0.1);
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledSubMenuItemWrapper = styled(Box)`
  display: inline-block;
  vertical-align: top;
  scroll-snap-align: start;
`;

export default StyledSubMenuItems;
