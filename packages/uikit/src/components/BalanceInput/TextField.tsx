import React from "react";
import Text from "../Text/Text";
import { StyledBalanceInput, StyledInput } from "./styles";
import { TextfieldProps } from "./types";

const Textfield: React.FC<React.PropsWithChildren<TextfieldProps>> = ({
  label,
  value,
  placeholder,
  onUserInput,
  inputProps,
  isWarning = false,
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUserInput(e.target.value);
  };

  return (
    <StyledBalanceInput isWarning={isWarning}>
      <Text fontSize="14px">{label}</Text>
      <StyledInput value={value} onChange={handleOnChange} placeholder={placeholder} textAlign="left" {...inputProps} />
    </StyledBalanceInput>
  );
};

export default Textfield;
