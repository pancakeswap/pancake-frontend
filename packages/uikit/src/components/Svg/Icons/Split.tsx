import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M9.333 2.667l1.527 1.526-1.92 1.92.947.947 1.92-1.92 1.526 1.527v-4h-4zm-2.666 0h-4v4L4.193 5.14l3.14 3.133v5.06h1.334V7.727L5.14 4.193l1.527-1.526z"
        fill="currentColor"
      />
    </Svg>
  );
};

export default Icon;
