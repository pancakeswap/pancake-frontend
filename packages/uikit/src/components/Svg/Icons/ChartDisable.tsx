import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 23 22" {...props}>
      <path d="M21.5 1l-20 20" strokeWidth={2} stroke="currentColor" strokeLinecap="round" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.033 19H19.5a1 1 0 100-2H9.033l-2 2zm3-3H18.5a1 1 0 001-1V6.533l-2 2V14h-2v-3.467l-2 2V14h-1.467l-2 2zm.936-8H10.5a1 1 0 00-1 1v.469L10.969 8zm-2 2L5.5 13.469V11a1 1 0 011-1h2.469zM4.5 14.469l-2 2V6a1 1 0 012 0v8.469z"
      />
    </Svg>
  );
};

export default Icon;
