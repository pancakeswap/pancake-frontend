import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Base: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_1475_1337)">
        <g clipPath="url(#clip1_1475_1337)">
          <path
            d="M18.5 8C18.5 13.799 13.799 18.5 8 18.5C2.20101 18.5 -2.5 13.799 -2.5 8C-2.5 2.20101 2.20101 -2.5 8 -2.5C13.799 -2.5 18.5 2.20101 18.5 8Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 14.5625C11.6244 14.5625 14.5625 11.6244 14.5625 8C14.5625 4.37563 11.6244 1.4375 8 1.4375C4.37563 1.4375 1.4375 4.37563 1.4375 8C1.4375 11.6244 4.37563 14.5625 8 14.5625ZM8 18.5C13.799 18.5 18.5 13.799 18.5 8C18.5 2.20101 13.799 -2.5 8 -2.5C2.20101 -2.5 -2.5 2.20101 -2.5 8C-2.5 13.799 2.20101 18.5 8 18.5Z"
            fill="#0052FF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.96875 8.65625H-2.5V7.34375H9.96875V8.65625Z"
            fill="#0052FF"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1475_1337">
          <rect width="16" height="16" fill="white" />
        </clipPath>
        <clipPath id="clip1_1475_1337">
          <rect width="21" height="21" fill="white" transform="translate(-2.5 -2.5)" />
        </clipPath>
      </defs>
    </Svg>
  );
};

export default Base;
