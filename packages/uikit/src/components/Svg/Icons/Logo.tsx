import React from "react";
import Image from "next/image";
import { SvgProps } from "../types";
import LogoImage from "../../../assets/logo-mobile.png";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <Image src={LogoImage} alt="logo" className="mobile-icon" />;
};

export default Icon;
