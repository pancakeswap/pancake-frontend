import React from "react";
import { Flex } from "../Box";
import StyledToggle, { Input, Handle } from "./StyledToggle";
import { ToggleProps, scales } from "./types";

const Toggle: React.FC<ToggleProps> = ({
  checked,
  defaultColor = "input",
  checkedColor = "success",
  scale = scales.LG,
  startIcon,
  endIcon,
  ...props
}) => {
  const isChecked = !!checked;

  return (
    <StyledToggle $checked={isChecked} $checkedColor={checkedColor} $defaultColor={defaultColor} scale={scale}>
      <Input checked={checked} scale={scale} {...props} type="checkbox" />
      {startIcon && endIcon ? (
        <>
          <Handle scale={scale}>
            <Flex height="100%" alignItems="center" justifyContent="center">
              {checked ? endIcon(checked) : startIcon(!checked)}
            </Flex>
          </Handle>
          <Flex width="100%" height="100%" justifyContent="space-around" alignItems="center">
            {startIcon()}
            {endIcon()}
          </Flex>
        </>
      ) : (
        <Handle scale={scale} />
      )}
    </StyledToggle>
  );
};

export default Toggle;
