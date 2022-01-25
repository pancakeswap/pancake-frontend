/* eslint-disable import/prefer-default-export */
import styled, { keyframes, css } from "styled-components";

const MountAnimation = keyframes`
    0% {
      bottom: -80vh;
    }
    100% {
      bottom: 0vh;
    }
  `;

const UnmountAnimation = keyframes`
    0% {
      bottom: 0vh;
    }
    100% {
      bottom: -80vh;
    }
  `;

export const DrawerContainer = styled.div<{ isUnmounting: boolean }>`
  width: 100%;
  height: 80vh;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  position: fixed;
  animation: ${MountAnimation} 350ms ease forwards;
  padding-bottom: env(safe-area-inset-bottom);
  html[data-useragent*="TokenPocket_iOS"] & {
    padding-bottom: 45px;
  }
  z-index: 21;
  ${({ isUnmounting }) =>
    isUnmounting &&
    css`
      animation: ${UnmountAnimation} 350ms ease forwards;
    `}
`;
