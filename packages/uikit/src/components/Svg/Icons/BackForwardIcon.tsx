import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M19.36 4.86l2.79 2.79c.19.19.19.51-.01.7l-2.79 2.79c-.31.32-.85.1-.85-.35V9h-14c-.55 0-1-.45-1-1s.45-1 1-1h14V5.21c0-.45.54-.67.86-.35zM5.64 19.14l-2.79-2.79a.492.492 0 01.01-.7l2.79-2.79c.31-.32.85-.1.85.35V15h14c.55 0 1 .45 1 1s-.45 1-1 1h-14v1.79c0 .45-.54.67-.86.35z" />
    </Svg>
  );
};

export default Icon;
