import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 20 20" {...props}>
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.28064 10.6416L2.20837 2.9165H7.01804L10.7664 7.69116L14.7709 2.938H17.4198L12.0472 9.3226L18.4177 17.4373H13.6224L9.56365 12.2738L5.23057 17.423H2.5673L8.28064 10.6416ZM14.3213 16.006L5.1575 4.34783H6.31855L15.4708 16.006H14.3213Z"
        />
      </g>
      <defs>
        <clipPath>
          <rect width="17" height="17" transform="translate(1.5 1.5)" />
        </clipPath>
      </defs>
    </Svg>
  );
};

export default Icon;
