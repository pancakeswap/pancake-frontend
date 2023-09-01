import React from "react";
import Image from "next/image";
import { SvgProps } from "../types";
import LogoImage from "../../../assets/logo-desktop.png";

const Logo: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <Image src={LogoImage} alt="logo" className="desktop-icon" />;
};

export default Logo;
