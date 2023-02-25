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
      {isBscScan && (
        <BscScanIcon
          width={props.fontSize ? props.fontSize.toString() : "20px"}
          color={props.color ? props.color : "primary"}
          ml="4px"
        />
      )}
      {isAptosScan && (
        <AptosIcon
          width={props.fontSize ? props.fontSize.toString() : "18px"}
          color={props.color ? props.color : "primary"}
          ml="4px"
        />
      )}
      {!isBscScan && !isAptosScan && (
        <OpenNewIcon
          width={props.fontSize ? props.fontSize.toString() : "20px"}
          color={props.color ? props.color : "primary"}
          ml="4px"
        />
      )}
    </Link>
  );
};

export default LinkExternal;
