import React, { ReactElement, useMemo } from "react";
import Link from "./Link";
import OpenNewIcon from "../Svg/Icons/OpenNew";
import BscScanIcon from "../Svg/Icons/BscScan";
import { LinkProps } from "./types";

interface ScanLinkProps extends Omit<LinkProps, "external" | "showExternalIcon"> {
  icon?: ReactElement;
  chainId?: number;
}

const icons: { [key: number]: ReactElement } = {
  56: <BscScanIcon />,
  97: <BscScanIcon />,
};

const ScanLink: React.FC<React.PropsWithChildren<ScanLinkProps>> = ({ children, icon, chainId, ...props }) => {
  const iconToShow = useMemo(() => {
    if (icon) return icon;
    if (chainId && icons[chainId]) return icons[chainId];
    return <OpenNewIcon />;
  }, [icon, chainId]);
  const iconElement = useMemo(() => {
    return React.isValidElement(iconToShow)
      ? React.cloneElement(iconToShow, {
          // @ts-ignore
          color: props.color ? props.color : "primary",
          ml: "4px",
        })
      : null;
  }, [iconToShow, props.color]);
  return (
    <Link external {...props}>
      {children}
      {iconElement}
    </Link>
  );
};

export default ScanLink;
