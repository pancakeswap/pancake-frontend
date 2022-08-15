import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 19 20" {...props}>
      <path d="M9.853.8a1 1 0 00-1.706 0L4.43 6.882a1 1 0 00.853 1.522h7.434a1 1 0 00.853-1.522L9.853.8zm4.647 9.604c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zM0 16.904a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2H2a2 2 0 00-2 2v4z" />
    </Svg>
  );
};

export default Icon;
