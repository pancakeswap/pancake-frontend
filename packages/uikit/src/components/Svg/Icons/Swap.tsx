import React from "react";
import Image from "next/image";
import { SvgProps } from "../types";
import LogoImage from "../../../assets/swap.png";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <Image src={LogoImage} className="menu-icon" alt="Swap" />;
};

export default Icon;
