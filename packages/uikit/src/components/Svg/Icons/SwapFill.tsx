import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 20 20" {...props}>
      <path d="M1.87 6.163a.75.75 0 01-1.06-1.06l2.608-2.61H1.694a.75.75 0 110-1.5h3.535a.75.75 0 01.75.75V5.28a.75.75 0 11-1.5 0V3.554L1.87 6.164zM13.072 1.976a5 5 0 01.421 9.983A6.505 6.505 0 008.09 6.555a5 5 0 014.982-4.579z" />
      <path d="M12.072 12.976a5 5 0 10-10 0 5 5 0 0010 0zM19.26 14.213a.75.75 0 010 1.061l-2.61 2.609h1.726a.75.75 0 010 1.5H14.84a.75.75 0 01-.75-.75v-3.536a.75.75 0 011.5 0v1.725l2.609-2.609a.75.75 0 011.06 0z" />
    </Svg>
  );
};

export default Icon;
