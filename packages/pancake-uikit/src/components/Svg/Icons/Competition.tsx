import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 18 18" {...props}>
      <path d="M16 2H14C14 0.895431 13.1046 0 12 0H6C4.89543 0 4 0.895431 4 2H2C0.9 2 0 2.9 0 4V5C0 7.55 1.92 9.63 4.39 9.94C5.02 11.44 6.37 12.57 8 12.9V16H5C4.44772 16 4 16.4477 4 17C4 17.5523 4.44772 18 5 18H13C13.5523 18 14 17.5523 14 17C14 16.4477 13.5523 16 13 16H10V12.9C11.63 12.57 12.98 11.44 13.61 9.94C16.08 9.63 18 7.55 18 5V4C18 2.9 17.1 2 16 2ZM2 5V4H4V7.82C2.84 7.4 2 6.3 2 5ZM9 11C7.35 11 6 9.65 6 8V2H12V8C12 9.65 10.65 11 9 11ZM16 5C16 6.3 15.16 7.4 14 7.82V4H16V5Z" />
    </Svg>
  );
};

export default Icon;
