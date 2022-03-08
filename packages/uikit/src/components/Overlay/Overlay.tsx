import styled, { css, keyframes } from "styled-components";
import { FC, useEffect } from "react";
import { Box, BoxProps } from "../Box";

const UnmountAnimation = keyframes`
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  `;

const StyledOverlay = styled(Box)<{ isUnmounting?: boolean }>`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => `${theme.colors.text}99`};
  z-index: 20;
  will-change: opacity;
  ${({ isUnmounting }) =>
    isUnmounting &&
    css`
      animation: ${UnmountAnimation} 350ms ease forwards;
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

export const Overlay: FC<OverlayProps> = (props) => {
  return (
    <>
      <BodyLock />
      <StyledOverlay role="presentation" {...props} />
    </>
  );
};

export default Overlay;
