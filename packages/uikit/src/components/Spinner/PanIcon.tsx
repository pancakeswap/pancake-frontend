import React from "react";
import Svg from "../Svg/Svg";
import { SvgProps } from "../Svg/types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 256 256" {...props}>
      <image width="300" height="300" href="/images/fly-1.png"/>
    </Svg>
   
   
  );
};

export default Icon;
