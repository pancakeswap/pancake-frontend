import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

export const ZksyncWithOutCircleIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 27 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15.3652 3.72137L7.96087 9.27481V15L0.5 7.44275L7.84783 0V3.72137H15.3652Z" />
      <path d="M19.0957 5.55343V0L26.5 7.5L19.0957 15V11.2214H11.6348L19.0957 5.55343Z" />
    </Svg>
  );
};
