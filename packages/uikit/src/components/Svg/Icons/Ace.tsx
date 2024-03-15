import React from "react";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <img src="https://cdn.jsdelivr.net/gh/tesseract-world/assets@main/ace.svg" alt="ace" {...props} />;
};

export default Icon;
