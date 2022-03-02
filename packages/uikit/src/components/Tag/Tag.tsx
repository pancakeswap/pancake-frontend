import React from "react";
import { scales, TagProps } from "./types";
import { StyledTag } from "./StyledTag";

const Tag: React.FC<TagProps> = ({
  startIcon,
  endIcon,
  children,
  variant = "primary",
  scale = scales.MD,
  outline = false,
  ...props
}) => (
  <StyledTag variant={variant} scale={scale} outline={outline} {...props}>
    {React.isValidElement(startIcon) &&
      React.cloneElement(startIcon, {
        mr: "0.5em",
      })}
    {children}
    {React.isValidElement(endIcon) &&
      React.cloneElement(endIcon, {
        ml: "0.5em",
      })}
  </StyledTag>
);

export default Tag;
