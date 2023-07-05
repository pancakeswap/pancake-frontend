import React from "react";
import Link from "./Link";
import { LinkProps } from "./types";
import OpenNewIcon from "../Svg/Icons/OpenNew";

const LinkExternal: React.FC<React.PropsWithChildren<LinkProps>> = ({
  children,
  showExternalIcon = true,
  ...props
}) => {
  return (
    <Link external {...props}>
      {children}
      {showExternalIcon && <OpenNewIcon color={props.color ? props.color : "primary"} ml="4px" />}
    </Link>
  );
};

export default LinkExternal;
