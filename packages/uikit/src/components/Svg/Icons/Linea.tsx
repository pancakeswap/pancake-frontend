import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Linea: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_1475_1361)">
        <mask id="mask0_1475_1361" maskUnits="userSpaceOnUse" x="2" y="1" width="12" height="13">
          <path d="M13.4495 1.64818H2.5V13.1194H13.4495V1.64818Z" fill="white" />
        </mask>
        <g mask="url(#mask0_1475_1361)">
          <path d="M11.5935 13.1195H2.5V3.50959H4.58062V11.257H11.5935V13.1184V13.1195Z" fill="white" />
          <path
            d="M11.5936 5.37101C12.6186 5.37101 13.4495 4.53762 13.4495 3.50959C13.4495 2.48156 12.6186 1.64818 11.5936 1.64818C10.5686 1.64818 9.73764 2.48156 9.73764 3.50959C9.73764 4.53762 10.5686 5.37101 11.5936 5.37101Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1475_1361">
          <rect width="11" height="11.5238" fill="white" transform="translate(2.5 1.61905)" />
        </clipPath>
      </defs>
    </Svg>
  );
};

export default Linea;
