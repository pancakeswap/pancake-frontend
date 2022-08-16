import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 200 200" {...props}>
      <rect width={200} height={200} rx={100} fill="#4A21EF" />
      <path
        d="M93.1 44a12.852 12.852 0 00-9.088 3.764L46.151 85.626A7.321 7.321 0 0044 90.82c0 1.88.717 3.759 2.151 5.193l24.812 24.812V76.899c0-3.278 2.636-5.936 5.914-5.936h52.159L155.999 44H93.1zM70.964 129.037h52.138a5.936 5.936 0 005.935-5.936V79.175l24.812 24.812A7.322 7.322 0 01156 109.18a7.32 7.32 0 01-2.151 5.193l-37.861 37.863A12.856 12.856 0 01106.9 156H44.001l26.963-26.963z"
        fill="#fff"
      />
    </Svg>
  );
};

export default Icon;
