import { Flex, Input as UIKitInput } from '@pancakeswap-libs/uikit'
import React from 'react'
import styled from 'styled-components'

export interface InputProps {
  endAdornment?: React.ReactNode
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
}

const StyledInput = styled(UIKitInput)`
  background: none;
  border: 0;
  box-shadow: none;
  font-size: 18px;
  flex: 1;
  outline: none;
`

const Input: React.FC<InputProps> = ({ endAdornment, onChange, placeholder, value }) => {
  return (
    <Flex alignItems="center">
      <StyledInput placeholder={placeholder} value={value} onChange={onChange} mr="8px" />
      {!!endAdornment && endAdornment}
    </Flex>
  )
}

export default Input
