import React from "react";
import Svg from "../../../components/Svg/Svg";
import { SvgProps } from "../../../components/Svg/types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M11.9701 2.73005C12.1301 2.39005 11.8501 2.01005 11.4701 2.03005C5.47006 2.33005 1.00006 7.86005 2.19006 13.9901C2.97006 18.0201 6.28006 21.2101 10.3301 21.8601C14.4001 22.5201 18.1001 20.7201 20.2001 17.7101C20.4101 17.4001 20.2401 16.9601 19.8701 16.9201C13.1301 16.1601 9.00006 8.96005 11.9701 2.73005Z" />
    </Svg>
  );
};

export default Icon;
