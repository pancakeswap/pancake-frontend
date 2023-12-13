import styled, { keyframes, css } from "styled-components";

export enum AnimationType {
  EXITING = "exiting",
}

export const LogoContainer = styled.div`
  height: 48px;
  width: 48px;
  position: relative;
  display: flex;
  border-radius: 50%;
  overflow: visible;
`;

export const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px) }
  to { opacity: 1; transform: translateX(0px) }
`;
export const slideInAnimation = css`
  animation: ${slideIn} 300ms ease-in-out;
`;
export const slideOut = keyframes`
  from { opacity: 1; transform: translateX(0px) }
  to { opacity: 0; transform: translateX(-40px) }
`;
export const slideOutAnimation = css`
  animation: ${slideOut} 300ms ease-in-out;
`;

export const fadeIn = keyframes`
  from { opacity: 0;}
  to { opacity: 1;}
`;
export const fadeAndScaleIn = keyframes`
  from { opacity: 0; transform: scale(0); }
  to { opacity: 1; transform: scale(1); }
`;
export const fadeInAnimation = css`
  animation: ${fadeIn} 250ms ease-in-out;
`;
export const fadeAndScaleInAnimation = css`
  animation: ${fadeAndScaleIn} 250ms ease-in-out;
`;

export const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0;  }
`;
export const fadeAndScaleOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0); }
`;
export const fadeOutAnimation = css`
  animation: ${fadeOut} 250ms ease-in-out;
`;
export const fadeAndScaleOutAnimation = css`
  animation: ${fadeAndScaleOut} 250ms ease-in-out;
`;

export const FadeWrapper = styled.div<{ $scale: boolean }>`
  transition: display 400ms ease-in-out;
    transform 250ms ease-in-out;
  ${({ $scale }) => ($scale ? fadeAndScaleInAnimation : fadeInAnimation)}

  &.${AnimationType.EXITING} {
    ${({ $scale }) => ($scale ? fadeAndScaleOutAnimation : fadeOutAnimation)}
  }
`;

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const RotationStyle = css`
  animation: 2s ${rotateAnimation} linear infinite;
`;

export const StyledSVG = styled.svg<{ size: string; stroke?: string; fill?: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  path {
    stroke: ${({ stroke }) => stroke};
    background: grey;
    fill: ${({ fill }) => fill};
  }
`;
