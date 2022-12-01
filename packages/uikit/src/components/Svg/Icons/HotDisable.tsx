import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M22.5 2l-20 20" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.66 20.372A7.966 7.966 0 0012.5 22c4.42 0 8-3.58 8-8 0-1.935-.332-3.793-.94-5.527l-2.851 2.851c.192.935.291 1.902.291 2.876.01 2.65-2.14 4.8-4.79 4.8a3.253 3.253 0 01-2.268-.909L7.66 20.372zM17.099 3.87a17.38 17.38 0 00-1.908-2.16c-.35-.34-.94-.02-.84.46.19.94.39 2.18.39 3.29 0 .292-.027.576-.08.848l2.438-2.438zM11.81 9.16c-.155.02-.315.031-.48.031-1.54 0-2.8-.93-3.35-2.26-.1-.2-.14-.32-.2-.54-.11-.42-.66-.55-.9-.18-.18.27-.35.54-.51.83A13.772 13.772 0 004.5 14c0 .752.104 1.48.298 2.17L11.81 9.16z"
      />
    </Svg>
  );
};

export default Icon;
