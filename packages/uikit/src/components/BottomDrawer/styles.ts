/* eslint-disable import/prefer-default-export */
import styled, { keyframes, css } from "styled-components";

const mountAnimation = keyframes`
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0%);
    }
  `;

const unmountAnimation = keyframes`
    0% {
      transform: translateY(0%);
    }
    100% {
      transform: translateY(100%);
    }
  `;

export const DrawerContainer = styled.div<{ isUnmounting: boolean }>`
  width: 100%;
  height: 80vh;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  position: fixed;
  animation: ${mountAnimation} 350ms ease forwards;
  padding-bottom: env(safe-area-inset-bottom);
  html[data-useragent*="TokenPocket_iOS"] & {
    padding-bottom: 45px;
  }
  will-change: transform;
  z-index: 21;
  ${({ isUnmounting }) =>
    isUnmounting &&
    css`
      animation: ${unmountAnimation} 350ms ease forwards;
    `}
`;
