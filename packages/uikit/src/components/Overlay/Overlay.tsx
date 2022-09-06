import styled, { css, keyframes } from "styled-components";
import { calc } from "@vanilla-extract/css-utils";
import { FC, useEffect } from "react";
import { Box, BoxProps } from "../Box";

const unmountAnimation = keyframes`
    0% {
      opacity: 0.6;
    }
    100% {
      opacity: 0;
    }
  `;

const mountAnimation = keyframes`
    0% {
     opacity: 0;
    }
    100% {
     opacity: 0.6;
    }
  `;

const StyledOverlay = styled.div<{ isUnmounting?: boolean }>`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.text};
  z-index: 20;
  will-change: opacity;
  animation: ${mountAnimation} 350ms ease forwards;
  ${({ isUnmounting }) =>
    isUnmounting &&
    css`
      animation: ${unmountAnimation} 350ms ease forwards;
    `}
`;

const BodyLock = () => {
  useEffect(() => {
    document.body.style.cssText = `
      overflow: hidden;
    `;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.cssText = `
        overflow: visible;
        overflow: overlay;
      `;
    };
  }, []);

  return null;
};

interface OverlayProps extends BoxProps {
  isUnmounting?: boolean;
}

export const Overlay: FC<React.PropsWithChildren<OverlayProps>> = (props) => {
  return (
    <>
      <BodyLock />
      <Box asChild {...props}>
        <StyledOverlay role="presentation" />
      </Box>
    </>
  );
};

export default Overlay;
