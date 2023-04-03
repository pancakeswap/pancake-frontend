import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const ZoomOut: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13.01 11h-.79l-.28-.27a6.471 6.471 0 001.57-4.23 6.5 6.5 0 10-6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L18 16l-4.99-5zm-6 0c-2.49 0-4.5-2.01-4.5-4.5S4.52 2 7.01 2s4.5 2.01 4.5 4.5S9.5 11 7.01 11zm-2.5-5h5v1h-5V6z"
        fill="currentColor"
      />
    </Svg>
  );
};

export default ZoomOut;
