import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 16 16" {...props}>
      <path d="M11.3333 11.3388L8.66667 8.67212V6.55212C9.44 6.27212 10 5.53879 10 4.67212C10 3.56545 9.10667 2.67212 8 2.67212C6.89333 2.67212 6 3.56545 6 4.67212C6 5.53879 6.56 6.27212 7.33333 6.55212V8.67212L4.66667 11.3388H2V14.6721H5.33333V12.6388L8 9.83879L10.6667 12.6388V14.6721H14V11.3388H11.3333Z" />
    </Svg>
  );
};

export default Icon;
