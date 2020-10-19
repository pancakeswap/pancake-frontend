import React from "react";
import StyledButton, { StartIcon, EndIcon } from "./StyledButton";
import { Props } from "./types.d";

const Button: React.FC<Props> = ({ startIcon, endIcon, children, ...props }) => {
  return (
    <StyledButton {...props}>
      {startIcon && <StartIcon>{startIcon}</StartIcon>}
      {children}
      {endIcon && <EndIcon>{endIcon}</EndIcon>}
    </StyledButton>
  );
};

Button.defaultProps = {
  variant: "primary",
  size: "md",
};

export default Button;
