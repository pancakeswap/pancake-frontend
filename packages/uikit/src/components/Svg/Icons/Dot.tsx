import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 8 8" {...props}>
      <circle cx="4" cy="4" r="4" />
    </Svg>
  );
};

export default Icon;
