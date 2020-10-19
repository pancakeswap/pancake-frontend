import React from "react";
import Button from "../Button";
import { sizes } from "../Button/types";
import { ButtonMenuItemProps } from "./types";

const ButtonMenuItem: React.FC<ButtonMenuItemProps> = ({ isActive = false, size = sizes.MD, ...props }) => {
  return <Button variant={isActive ? "primary" : "secondary"} size={size} {...props} />;
};

export default ButtonMenuItem;
