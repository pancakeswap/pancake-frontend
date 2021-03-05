import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 14 2" {...props}>
      <path
        d="M13 2L1 2C0.45 2 0 1.55 0 1C0 0.45 0.45 0 1 0L13 0C13.55 0 14 0.45 14 1C14 1.55 13.55 2 13 2Z"
        fill="#1FC7D4"
      />
    </Svg>
  );
};

export default Icon;
