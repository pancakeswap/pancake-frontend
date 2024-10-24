/* eslint-disable import/prefer-default-export */
import { keyframes, styled } from "styled-components";

export const mountAnimation = keyframes`
    0% {
      transform: translateY(20%);
    }
    100% {
      transform: translateY(0%);
    }
  `;

export const unmountAnimation = keyframes`
    0% {
      transform: translateY(0%);
    }
    100% {
      transform: translateY(20%);
    }
  `;

export const DrawerContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  height: 80vh;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 21;
`;
