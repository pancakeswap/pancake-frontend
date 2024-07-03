import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 16 5" {...props}>
      <path
        d="M0.5 20C0.5 9.23046 9.23045 0.5 20 0.5H60C70.7695 0.5 79.5 9.23045 79.5 20V60.0003C79.5 70.7698 70.7695 79.5003 60 79.5003H20C9.23045 79.5003 0.5 70.7699 0.5 60.0003V20Z"
        fill="url(#pattern0_2423_223144)"
      />
      <path
        d="M0.5 20C0.5 9.23046 9.23045 0.5 20 0.5H60C70.7695 0.5 79.5 9.23045 79.5 20V60.0003C79.5 70.7698 70.7695 79.5003 60 79.5003H20C9.23045 79.5003 0.5 70.7699 0.5 60.0003V20Z"
        stroke="#E7E3EB"
      />
    </Svg>
  );
};

export default Icon;
