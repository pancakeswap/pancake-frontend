import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="-10 0 64 62.03" {...props}>
      <path xmlns="http://www.w3.org/2000/svg" fill="#2FE9FF" d="M22.7319 2.06934V9.87229L0 19.094L22.7319 2.06934Z" />
      <path
        xmlns="http://www.w3.org/2000/svg"
        fill="#4C47F7"
        d="M18.4696 1.71387V15.1917C18.4696 19.1094 15.2892 22.2853 11.3659 22.2853C7.44265 22.2853 4.26221 19.1094 4.26221 15.1917V9.51682L8.52443 7.17594V15.1917C8.52443 16.5629 9.63759 17.6745 11.0107 17.6745C12.3839 17.6745 13.497 16.5629 13.497 15.1917V4.4449L18.4696 1.71387Z"
      />
    </Svg>
  );
};

export default Icon;
