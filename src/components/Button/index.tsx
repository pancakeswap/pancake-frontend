import React from "react";
import StyledButton from "./StyledButton";
import { ButtonProps, variants, sizes } from "./types";

const Button: React.FC<ButtonProps> = ({ startIcon, endIcon, children, ...props }) => (
  <StyledButton {...props}>
    {React.isValidElement(startIcon) &&
      React.cloneElement(startIcon, {
        mr: "0.5rem",
      })}
    {children}
    {React.isValidElement(endIcon) &&
      React.cloneElement(endIcon, {
        ml: "0.5rem",
      })}
  </StyledButton>
);

Button.defaultProps = {
  variant: variants.PRIMARY,
  size: sizes.MD,
};

export default Button;
