import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="-10 0 64 62.03" {...props}>
      <path
        fill="#afd8f7"
        d="M95.21,76.12a1.51,1.51,0,0,1,1.49,1.35v.45a22.62,22.62,0,0,1-44.94.34l0-.51v-.27a1.5,1.5,0,0,1,1.49-1.36Z"
        transform="translate(-51.71 -36.08)"
      />
      <path
        fill="#182a71"
        d="M52.55,36.08c10.64,0,19.18,8.26,19.18,18.46v18a1.5,1.5,0,0,1-1.5,1.5h-17a1.5,1.5,0,0,1-1.5-1.5V36.92a.83.83,0,0,1,.74-.83Z"
        transform="translate(-51.71 -36.08)"
      />
      <path
        fill="#3485c4"
        d="M95.79,68l.11.36-.08-.24a13.75,13.75,0,0,1,.89,3.81,2,2,0,0,1-1.83,2.16H86.14c-5.91,0-10.73-4.18-10.88-10V53.9a1,1,0,0,1,1-1A21.42,21.42,0,0,1,95.79,68Z"
        transform="translate(-51.71 -36.08)"
      />
    </Svg>
  );
};

export default Icon;
