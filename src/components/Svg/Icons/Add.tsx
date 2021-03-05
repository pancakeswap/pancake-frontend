import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 14 14" {...props}>
      <path
        d="M13 8L8 8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8L1 8C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6L6 6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6L13 6C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z"
        fill="#1FC7D4"
      />
    </Svg>
  );
};

export default Icon;
