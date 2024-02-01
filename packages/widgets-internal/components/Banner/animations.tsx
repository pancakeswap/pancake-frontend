import { keyframes } from "styled-components";

export const flyingAnim = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, 5px);
  }
  to {
    transform: translate(0, 0px);
  }
`;

export const flyingVerticalAnim = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(0, 2px);
  }
  to {
    transform: translate(0, 0px);
  }
`;
