import React from "react";
import Link from "./Link";
import { LinkProps } from "./types";
import OpenNewIcon from "../Svg/Icons/OpenNew";
import BscScanIcon from "../Svg/Icons/BscScan";
import AptosIcon from "../Svg/Icons/Aptos";

const LinkExternal: React.FC<React.PropsWithChildren<LinkProps>> = ({
  children,
  isBscScan = false,
  isAptosScan = false,
  ...props
}) => {
  return (
    <Link external {...props}>
      {children}
      {isBscScan && <BscScanIcon color={props.color ? props.color : "primary"} ml="4px" />}
      {isAptosScan && <AptosIcon width="18" height="18" color={props.color ? props.color : "primary"} ml="4px" />}
      {!isBscScan && !isAptosScan && <OpenNewIcon color={props.color ? props.color : "primary"} ml="4px" />}
    </Link>
  );
};

export default LinkExternal;
