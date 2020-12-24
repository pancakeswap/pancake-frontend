import React from "react";
import styled, { keyframes } from "styled-components";
import { SkeletonProps, animation as ANIMATION, variant as VARIANT } from "./types";

const waves = keyframes`
   from {
        left: -150px;
    }
    to   {
        left: 100%;
    }
`;

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

const Root = styled.div<{ variant: SkeletonProps["variant"]; width?: number; height?: number }>`
  min-height: 20px;
  display: block;
  background-color: ${({ theme }) => theme.colors.textDisabled};
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  height: ${({ height }) => (height ? `${height}px` : "100%")};
  border-radius: ${({ variant, theme }) => (variant === VARIANT.CIRCLE ? theme.radii.circle : theme.radii.small)};
`;

const Pulse = styled(Root)`
  animation: ${pulse} 2s infinite ease-out;
`;

const Waves = styled(Root)`
  position: relative;
  overflow: hidden;
  &:before {
    content: "";
    position: absolute;
    background-image: linear-gradient(90deg, transparent, rgba(243, 243, 243, 0.5), transparent);
    top: 0;
    left: -150px;
    height: 100%;
    width: 150px;
    animation: ${waves} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
`;

const Skeleton: React.FC<SkeletonProps> = ({ width, height, variant = VARIANT.RECT, animation = ANIMATION.PULSE }) => {
  return (
    <>
      {animation === ANIMATION.PULSE && <Pulse variant={variant} width={width} height={height} />}
      {animation === ANIMATION.WAVES && <Waves variant={variant} width={width} height={height} />}
    </>
  );
};

export default Skeleton;
