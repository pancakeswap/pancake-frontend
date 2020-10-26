import React, { InputHTMLAttributes } from "react";
import StyledToggle, { Input, Handle } from "./StyledToggle";

const Toggle: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ checked, ...props }) => {
  const isChecked = !!checked;

  return (
    <StyledToggle checked={isChecked}>
      <Input checked={checked} {...props} type="checkbox" />
      <Handle />
    </StyledToggle>
  );
};

export default Toggle;
