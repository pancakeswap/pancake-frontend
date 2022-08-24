import React, { useEffect, useState } from "react";
import throttle from "lodash/throttle";
import styled, { css } from "styled-components";
import { DropdownProps, PositionProps, Position } from "./types";
import { useMatchBreakpoints } from "../../contexts";

const getLeft = ({ position }: PositionProps) => {
  if (position === "top-right") {
    return "100%";
  }
  return "50%";
};

const getBottom = ({ position }: PositionProps) => {
  if (position === "top" || position === "top-right") {
    return "100%";
  }
  return "auto";
};

const DropdownContent = styled.div<{ position: Position }>`
  width: max-content;
  display: flex;
  flex-direction: column;
  position: absolute;
  transform: translate(-50%, 0);
  left: ${getLeft};
  bottom: ${getBottom};
  background-color: ${({ theme }) => theme.nav.background};
  box-shadow: ${({ theme }) => theme.shadows.level1};
  padding: 16px;
  max-height: 0px;
  overflow: hidden;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  border-radius: ${({ theme }) => theme.radii.small};
  opacity: 0;
  transition: max-height 0s 0.3s, opacity 0.3s ease-in-out;
  will-change: opacity;
  pointer-events: none;
`;

const Container = styled.div<{ $scrolling: boolean }>`
  position: relative;
  ${({ $scrolling }) =>
    !$scrolling &&
    css`
      &:hover ${DropdownContent}, &:focus-within ${DropdownContent} {
        opacity: 1;
        max-height: 400px;
        overflow-y: auto;
        transition: max-height 0s 0s, opacity 0.3s ease-in-out;
        pointer-events: auto;
      }
    `}
`;

const Dropdown: React.FC<React.PropsWithChildren<DropdownProps>> = ({ target, position = "bottom", children }) => {
  const [scrolling, setScrolling] = useState(false);
  const { isMobile } = useMatchBreakpoints();

  useEffect(() => {
    if (isMobile) {
      let scrollEndTimer: number;
      const handleScroll = () => {
        if (scrollEndTimer) clearTimeout(scrollEndTimer);
        setScrolling(true);
        // @ts-ignore
        scrollEndTimer = setTimeout(() => {
          setScrolling(false);
        }, 300);
      };

      const throttledHandleScroll = throttle(handleScroll, 200);
      document.addEventListener("scroll", throttledHandleScroll);
      return () => {
        document.removeEventListener("scroll", throttledHandleScroll);
      };
    }
    return undefined;
  }, [isMobile]);

  return (
    <Container $scrolling={scrolling}>
      {target}
      <DropdownContent position={position}>{children}</DropdownContent>
    </Container>
  );
};
Dropdown.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  position: "bottom",
};

export default Dropdown;
