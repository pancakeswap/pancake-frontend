import styled, { css } from "styled-components";
import { Flex, Box } from "../Box";

export const SubMenuItemWrapper = styled(Flex)<{ $isMobileOnly: boolean }>`
  ${({ theme }) => theme.mediaQueries.sm} {
    ${({ $isMobileOnly }) => ($isMobileOnly ? "display:none" : "")};
  }
  width: 100%;
  overflow: hidden;
  position: relative;
`;
const StyledSubMenuItems = styled(Flex)`
  position: relative;
  z-index: 1;
  width: 100%;
  display: block;
  white-space: nowrap;
  scroll-behavior: smooth;
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

const maskSharedStyle = css`
  position: absolute;
  z-index: 2;
  width: 48px;
  height: 100%;
  top: 0px;
  display: flex;
  justify-content: center;
  will-change: opacity;
  pointer-events: none;
  opacity: 0;
  transition: 0.25s ease-out opacity;

  &.show {
    pointer-events: auto;
    opacity: 1;
    transition: 0.25s ease-in opacity;
  }
`;

export const LeftMaskLayer = styled.div`
  ${maskSharedStyle}
  left: 0px;
  background: ${({ theme }) =>
    theme.isDark
      ? `linear-gradient(90deg, #27262c 29.76%, rgba(39,38,44, 0) 100%)`
      : `linear-gradient(90deg, #ffffff 29.76%, rgba(255, 255, 255, 0) 100%)`};
`;
export const RightMaskLayer = styled.div`
  ${maskSharedStyle}
  right: 0px;
  background: ${({ theme }) =>
    theme.isDark
      ? `linear-gradient(270deg, #27262c 0%, rgba(39,38,44, 0) 87.5%)`
      : `linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 87.5%)`};
`;

export const StyledSubMenuItemWrapper = styled(Box)`
  display: inline-block;
  vertical-align: top;
  scroll-snap-align: start;
`;

export default StyledSubMenuItems;
