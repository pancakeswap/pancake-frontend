/* eslint-disable import/prefer-default-export */
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
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  position: fixed;
  animation: ${MountAnimation} 350ms ease forwards;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 21;
  ${({ isUnmounting }) =>
    isUnmounting &&
    css`
      animation: ${UnmountAnimation} 350ms ease forwards;
    `}
`;
