import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const ZkSync: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_1401_32485)">
        <path
          d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
          fill="black"
        />
        <path
          d="M10.7653 11.6562L14.4375 7.98472L10.7653 4.3125V7.06681L7.09375 9.82047H10.7653V11.6562Z"
          fill="white"
        />
        <path d="M5.23472 4.3125L1.5625 7.98472L5.23472 11.6562V8.90259L8.90625 6.14894H5.23472V4.3125Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1401_32485">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </Svg>
  );
};

export default ZkSync;
