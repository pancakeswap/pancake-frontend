import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 123 116" {...props}>
      <g clipPath="url(#clip0_1191_61418)">
        <rect width={123} height={116} rx={19} fill="#3C444F" />
        <path
          d="M36.49 96V26.182h27.545c5.296 0 9.807 1.011 13.535 3.034 3.727 2 6.568 4.784 8.522 8.352 1.978 3.546 2.966 7.637 2.966 12.273s-1 8.727-3 12.273c-2 3.545-4.898 6.307-8.693 8.284-3.773 1.977-8.34 2.966-13.704 2.966H46.103v-11.83h15.17c2.841 0 5.182-.489 7.023-1.466 1.864-1 3.25-2.375 4.159-4.125.932-1.773 1.398-3.807 1.398-6.102 0-2.318-.466-4.341-1.398-6.068-.91-1.75-2.296-3.103-4.16-4.057-1.863-.977-4.226-1.466-7.09-1.466h-9.955V96h-14.76z"
          fill="#fff"
        />
      </g>
      <defs>
        <clipPath id="clip0_1191_61418">
          <path fill="#fff" d="M0 0H123V116H0z" />
        </clipPath>
      </defs>
    </Svg>
  );
};

export default Icon;
