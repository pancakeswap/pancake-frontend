import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M12 2C6.48001 2 2.00001 6.48 2.00001 12C2.00001 17.52 6.48001 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" />
      <path
        d="M11 7H13V9H11V7ZM12 17C12.55 17 13 16.55 13 16V12C13 11.45 12.55 11 12 11C11.45 11 11 11.45 11 12V16C11 16.55 11.45 17 12 17Z"
        fill="white"
      />
    </Svg>
  );
};

export default Icon;
