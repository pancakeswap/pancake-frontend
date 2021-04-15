import React from "react";
import Text from "../Text/Text";
import { StyledBalanceInput, StyledInput } from "./styles";
import { BalanceInputProps } from "./types";

const BalanceInput: React.FC<BalanceInputProps> = ({
  value,
  placeholder = "0.0",
  onChange,
  currencyValue,
  inputProps,
  isWarning = false,
  ...props
}) => {
  return (
    <StyledBalanceInput isWarning={isWarning} {...props}>
      <StyledInput type="number" value={value} onChange={onChange} placeholder={placeholder} {...inputProps} />
      {currencyValue && (
        <Text fontSize="12px" textAlign="right" color="textSubtle">
          {currencyValue}
        </Text>
      )}
    </StyledBalanceInput>
  );
};

export default BalanceInput;
