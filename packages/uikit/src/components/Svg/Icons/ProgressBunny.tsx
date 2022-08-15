import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 34 38" {...props}>
      <rect x="8.83594" width="5.30132" height="17.3191" rx="2.65066" fill="#D1884F" />
      <rect x="19.4385" width="5.30132" height="17.3191" rx="2.65066" fill="#D1884F" />
      <path
        d="M8.5 13.0084C13.1944 8.40751 20.8056 8.40751 25.5 13.0084C30.1944 17.6093 30.1944 25.0689 25.5 29.6698L17.6538 37.3597C17.2927 37.7136 16.7073 37.7136 16.3462 37.3597L8.5 29.6698C3.80558 25.0689 3.80558 17.6093 8.5 13.0084Z"
        fill="#D1884F"
      />
      <ellipse cx="12.3696" cy="19.9172" rx="1.76711" ry="2.59786" fill="white" />
      <ellipse cx="21.2056" cy="19.9172" rx="1.76711" ry="2.59786" fill="white" />
    </Svg>
  );
};

export default Icon;
