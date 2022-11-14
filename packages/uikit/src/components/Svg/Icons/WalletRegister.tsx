import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 7.672c1.5 0 2 .5 2 2l2 2a2 2 0 012 2v5c0 2-1 3-3.001 3H6c-2 0-3-1-3-3v-8c0-1.5 1.5-3 3-3h7zm-8 3a1 1 0 011-1h9l2 2H6a1 1 0 01-1-1z"
      />
      <circle cx={15.5} cy={16.1721} r={1.5} fill="#F5F5F5" />
      <path d="M22.125 6.297h-1.75v-1.75a.878.878 0 00-.875-.875.878.878 0 00-.875.875v1.75h-1.75a.878.878 0 00-.875.875c0 .481.394.875.875.875h1.75v1.75c0 .481.394.875.875.875a.878.878 0 00.875-.875v-1.75h1.75A.878.878 0 0023 7.172a.878.878 0 00-.875-.875z" />
    </Svg>
  );
};

export default Icon;
