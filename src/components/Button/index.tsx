import React from "react";
import StyledButton, { StartIcon, EndIcon } from "./StyledButton";
import { ButtonProps, variants, sizes } from "./types";

const Button: React.FC<ButtonProps> = ({ startIcon, endIcon, children, ...props }) => {
  return (
    <StyledButton {...props}>
      {startIcon && <StartIcon>{startIcon}</StartIcon>}
      {children}
      {endIcon && <EndIcon>{endIcon}</EndIcon>}
    </StyledButton>
  );
};

Button.defaultProps = {
  variant: variants.PRIMARY,
  size: sizes.MD,
};

export default Button;
