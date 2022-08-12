import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 18 20" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.95.446a1.5 1.5 0 00-1.11 1.808c.08.327.457 1.213.877 2.15H2c-1.1 0-2 .9-2 2v1c0 .319.03.63.087.931.401 2.111 2.142 3.738 4.303 4.009A5.01 5.01 0 008 15.304v2.1H5a1 1 0 100 2h8.006a1 1 0 00-.006-2h-3v-2.1a5.013 5.013 0 003.61-2.96c.309-.039.609-.105.898-.197C16.53 11.507 18 9.635 18 7.404v-1c0-1.1-.9-2-2-2h-3.718c.42-.937.798-1.823.877-2.15a1.5 1.5 0 00-2.918-.7l-.683 2.85H8.442l-.684-2.85A1.5 1.5 0 005.949.446zM16 7.404c0 1.3-.84 2.4-2 2.82v-3.82h2v1zm-12 2.82c-1.16-.42-2-1.52-2-2.82v-1h2v3.82z"
    />
  </Svg>
);

export default Icon;
