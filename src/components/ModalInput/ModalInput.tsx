import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex } from '@pancakeswap-libs/uikit'
import useI18n from '../../hooks/useI18n'

interface ModalInputProps {
  max: number | string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
}

const getBoxShadow = ({ isSuccess = false, isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  if (isSuccess) {
    return theme.shadows.success
  }

  return theme.shadows.inset
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px;
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  width: auto;
  padding: 0;
  margin-right: 8px;
`

const ModalInput: React.FC<ModalInputProps> = ({ max, symbol, onChange, onSelectMax, value }) => {
  const TranslateString = useI18n()
  return (
    <StyledTokenInput isWarning>
      <Flex justifyContent="space-between">
        <Text fontSize="14px">{TranslateString(999, 'Deposit')}</Text>
        <Text fontSize="14px">
          {TranslateString(999, 'Balance')}: {max.toLocaleString()}
        </Text>
      </Flex>
      <Flex alignItems="flex-end">
        <StyledInput onChange={onChange} placeholder="0" value={value} />
        <Button size="sm" onClick={onSelectMax} mr="8px">
          {TranslateString(452, 'Max')}
        </Button>
        <Text fontSize="16px">{symbol}</Text>
      </Flex>
    </StyledTokenInput>
  )
}

export default ModalInput
