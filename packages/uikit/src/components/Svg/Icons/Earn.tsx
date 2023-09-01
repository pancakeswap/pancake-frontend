import React from "react";
import Image from "next/image";
import { SvgProps } from "../types";
import LogoImage from "../../../assets/farms.png";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Image src={LogoImage} className="menu-icon" alt="Farms" />
);

export default Icon;
