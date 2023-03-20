import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const ZoomIn: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12.52 11H11.73L11.45 10.73C12.43 9.59 13.02 8.11 13.02 6.5C13.02 2.91 10.11 0 6.52002 0C2.93002 0 0.0200195 2.91 0.0200195 6.5C0.0200195 10.09 2.93002 13 6.52002 13C8.13002 13 9.61002 12.41 10.75 11.43L11.02 11.71V12.5L16.02 17.49L17.51 16L12.52 11ZM6.52002 11C4.03002 11 2.02002 8.99 2.02002 6.5C2.02002 4.01 4.03002 2 6.52002 2C9.01002 2 11.02 4.01 11.02 6.5C11.02 8.99 9.01002 11 6.52002 11ZM7.02002 4H6.02002V6H4.02002V7H6.02002V9H7.02002V7H9.02002V6H7.02002V4Z"
        fill="currentColor"
      />
    </Svg>
  );
};

export default ZoomIn;
