import React from "react";
import { TagProps, variants } from "./types";
import { StyledTag, StartIcon, EndIcon } from "./StyledTag";

const Tag: React.FC<TagProps> = ({ startIcon, endIcon, children, ...props }) => (
  <StyledTag {...props}>
    {startIcon && <StartIcon>{startIcon}</StartIcon>}
    {children}
    {endIcon && <EndIcon>{endIcon}</EndIcon>}
  </StyledTag>
);

Tag.defaultProps = {
  variant: variants.PURPLE,
};

export default Tag;
