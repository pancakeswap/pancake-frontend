import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 25 24" {...props}>
      <path
        d="M19.2 3H5.19995C4.09995 3 3.19995 3.9 3.19995 5V19C3.19995 20.1 4.09995 21 5.19995 21H19.2C20.3 21 21.2 20.1 21.2 19V5C21.2 3.9 20.3 3 19.2 3ZM19.2 19H5.19995V5H19.2V19Z"
        fill="#1FC7D4"
      />
      <path d="M11.45 7.72021H6.44995V9.22022H11.45V7.72021Z" fill="#1FC7D4" />
      <path d="M18.2 15.75H13.2V17.25H18.2V15.75Z" fill="#1FC7D4" />
      <path d="M18.2 13.25H13.2V14.75H18.2V13.25Z" fill="#1FC7D4" />
      <path d="M8.19995 18H9.69995V16H11.7V14.5H9.69995V12.5H8.19995V14.5H6.19995V16H8.19995V18Z" fill="#1FC7D4" />
      <path
        d="M14.29 10.95L15.7 9.54L17.11 10.95L18.17 9.89L16.76 8.47L18.17 7.06L17.11 6L15.7 7.41L14.29 6L13.23 7.06L14.64 8.47L13.23 9.89L14.29 10.95Z"
        fill="#1FC7D4"
      />
    </Svg>
  );
};

export default Icon;
