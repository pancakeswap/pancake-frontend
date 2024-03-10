import React from "react";
import { styled } from "styled-components";
import { SpinnerProps } from "./types";
import { Box } from "../Box";

const W = styled.div`
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SVG = styled.svg`
  stroke: rgb(94, 94, 94);
  fill: rgb(94, 94, 94);
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  top: -4px;
  left: -4px;
  position: absolute;
  animation: 2s linear 0s infinite normal none running spinner;
`;

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 90 }) => {
  return (
    <Box width={size} height={size * 1.2} position="relative">
      <W>
        <SVG viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg" fill="#5E5E5E" stroke="#5E5E5E">
          <path
            opacity="0.1"
            d="M53.6666 26.9999C53.6666 41.7275 41.7276 53.6666 27 53.6666C12.2724 53.6666 0.333313 41.7275 0.333313 26.9999C0.333313 12.2723 12.2724 0.333252 27 0.333252C41.7276 0.333252 53.6666 12.2723 53.6666 26.9999ZM8.33331 26.9999C8.33331 37.3092 16.6907 45.6666 27 45.6666C37.3093 45.6666 45.6666 37.3092 45.6666 26.9999C45.6666 16.6906 37.3093 8.33325 27 8.33325C16.6907 8.33325 8.33331 16.6906 8.33331 26.9999Z"
            fill="#5E5E5E"
          />
          <path
            d="M49.6666 26.9999C51.8758 26.9999 53.6973 25.1992 53.3672 23.0149C53.0452 20.884 52.4652 18.7951 51.6368 16.795C50.2966 13.5597 48.3324 10.62 45.8562 8.14374C43.3799 5.66751 40.4402 3.70326 37.2049 2.36313C35.2048 1.53466 33.1159 0.954747 30.985 0.632693C28.8007 0.30256 27 2.12411 27 4.33325C27 6.54239 28.8108 8.29042 30.9695 8.76019C32.0523 8.99585 33.1146 9.32804 34.1434 9.75417C36.4081 10.6923 38.4659 12.0672 40.1993 13.8006C41.9327 15.534 43.3076 17.5918 44.2457 19.8565C44.6719 20.8853 45.004 21.9476 45.2397 23.0304C45.7095 25.1891 47.4575 26.9999 49.6666 26.9999Z"
            fill="#5E5E5E"
          />
        </SVG>
      </W>
    </Box>
  );
};

export default Spinner;
