import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 10 14" fill="none" {...props}>
      <path d="M4.99103 0.174805V5.13368L9.18211 7.00671L4.99103 0.174805Z" fill="white" fillOpacity="0.602" />
      <path d="M4.99083 0.174805L0.799744 7.00671L4.99083 5.13368V0.174805Z" fill="white" />
      <path d="M4.99103 10.2201V13.5896L9.18456 7.78711L4.99103 10.2201Z" fill="white" fillOpacity="0.602" />
      <path d="M4.99083 13.5896V10.2201L0.799744 7.78711L4.99083 13.5896Z" fill="white" />
      <path d="M4.99103 9.4398L9.18211 7.00682L4.99103 5.13379V9.4398Z" fill="white" fillOpacity="0.2" />
      <path d="M0.799744 7.00682L4.99083 9.4398V5.13379L0.799744 7.00682Z" fill="white" fillOpacity="0.602" />
    </Svg>
  );
};

export default Icon;
