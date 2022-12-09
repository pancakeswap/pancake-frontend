import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.65 3.35002L5.86 6.14002C5.54 6.45002 5.76 6.99002 6.21 6.99002H8V13C8 13.55 8.45 14 9 14C9.55 14 10 13.55 10 13V6.99002H11.79C12.24 6.99002 12.46 6.45002 12.14 6.14002L9.35 3.35002C9.16 3.16002 8.84 3.16002 8.65 3.35002Z" />
      <path d="M16 11V17.01H17.8C18.24 17.01 18.47 17.55 18.15 17.86L15.36 20.64C15.16 20.83 14.85 20.83 14.65 20.64L11.86 17.86C11.54 17.55 11.76 17.01 12.21 17.01H14V11C14 10.45 14.45 10 15 10C15.55 10 16 10.45 16 11Z" />
    </Svg>
  );
};

export default Icon;
