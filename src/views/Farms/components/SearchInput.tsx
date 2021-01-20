import React from 'react';
import { Input } from '@pancakeswap-libs/uikit'
import styled from "styled-components";

const StyledInput = styled(Input)`
  width: 20rem;
  border-radius: 1rem;
  margin-left: auto;
`;

interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FunctionComponent<Props> = ({ value, onChange }) => {
  return (
    <StyledInput
      value={value}
      onChange={onChange}
    />
  )
}

export default SearchInput;