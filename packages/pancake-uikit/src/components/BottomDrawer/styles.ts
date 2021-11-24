import styled, { keyframes, css } from "styled-components";

const MountAnimation = keyframes`
    0% {
      bottom: ${-window.innerHeight}px;
    }
    100% {
      bottom: ${-window.innerHeight * 0.01}px
    }
  `;

const UnmountAnimation = keyframes`
    0% {
      bottom: ${-window.innerHeight * 0.01}px
    }
    100% {
      bottom: ${-window.innerHeight}px;
    }
  `;

export const DrawerContainer = styled.div<{ isUnmounting: boolean }>`
  width: 100%;
  height: ${window.innerHeight * 0.81}px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 10;
  border-radius: 32px;
  position: fixed;
  animation: ${MountAnimation} 350ms ease forwards;
  ${({ isUnmounting }) =>
    isUnmounting &&
    css`
      animation: ${UnmountAnimation} 350ms ease forwards;
    `}
`;

export const StyledOverlay = styled.div`
  content: "";
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => `${theme.colors.text}99`};
  backdrop-filter: blur(1px);
  z-index: 10;
`;
