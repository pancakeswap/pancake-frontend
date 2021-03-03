import { Flex } from '@pancakeswap-libs/uikit'
import React from 'react'
import styled from 'styled-components'

export interface InputProps {
  endAdornment?: React.ReactNode
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
}

const StyledInput = styled.input`
  width: 100%;
  background: none;
  border: 0;
  font-size: 18px;
  flex: 1;
  margin: 0;
  padding: 0 8px 0 0;
  outline: none;
`

const Input: React.FC<InputProps> = ({ endAdornment, onChange, placeholder, value }) => {
  return (
    <Flex alignItems="center">
      <StyledInput placeholder={placeholder} value={value} onChange={onChange} />
      {!!endAdornment && endAdornment}
    </Flex>
  )
}

export default Input
