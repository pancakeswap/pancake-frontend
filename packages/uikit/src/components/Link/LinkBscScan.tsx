import React from "react";
import Link from "./Link";
import { LinkProps } from "./types";
import BscScan from "../Svg/Icons/BscScan";

const LinkBscScan: React.FC<React.PropsWithChildren<LinkProps>> = ({ children, ...props }) => {
  return (
    <Link external {...props}>
      {children}
      <BscScanIcon color={props.color ? props.color : "primary"} ml="4px" />
    </Link>
  );
};

export default LinkBscScan;
