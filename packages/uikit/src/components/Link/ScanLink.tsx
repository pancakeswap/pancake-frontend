import React, { useMemo } from "react";
import Link from "./Link";
import OpenNewIcon from "../Svg/Icons/OpenNew";
import BscScanIcon from "../Svg/Icons/BscScan";
import AptosIcon from "../Svg/Icons/Aptos";
import { LinkProps } from "./types";

interface ScanLinkProps extends Omit<LinkProps, "external" | "showExternalIcon"> {
  forceChain?: "BSC" | "APTOS" | string;
}

const ScanLink: React.FC<React.PropsWithChildren<ScanLinkProps>> = ({ children, forceChain, ...props }) => {
  const { href } = props;
  const isBscScan = useMemo(() => (forceChain || href)?.toLowerCase()?.includes("bsc"), [forceChain, href]);
  const isAptosScan = useMemo(() => (forceChain || href)?.toLowerCase()?.includes("aptos"), [forceChain, href]);

  return (
    <Link external {...props}>
      {children}
      {isBscScan && <BscScanIcon color={props.color ? props.color : "primary"} ml="4px" />}
      {isAptosScan && <AptosIcon width="18" height="18" color={props.color ? props.color : "primary"} ml="4px" />}
      {!isBscScan && !isAptosScan && <OpenNewIcon color={props.color ? props.color : "primary"} ml="4px" />}
    </Link>
  );
};

export default ScanLink;
