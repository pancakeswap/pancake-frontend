import React from 'react'
import styled from 'styled-components'
import { Button, Box, BoxProps, Flex, Input as UIKitInput, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

export interface BalanceInputProps extends BoxProps {
  title: string
  max: number
  symbol: string
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
  value: string
  onSelectMax?: () => void
}

const StyledBalanceInput = styled(Box)`
  background: ${({ theme }) => theme.colors.input};
  box-shadow: 0px 2px 2px -1px rgba(0, 0, 0, 0.2) inset;
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 8px 16px;
`

const Input = styled(UIKitInput)`
  box-shadow: none;
  flex: 1;
`

const TokenSymbol = styled(Text)`
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`

const BalanceInput: React.FC<BalanceInputProps> = ({ title, max, symbol, onChange, onSelectMax, value, ...props }) => {
  const TranslateString = useI18n()
  const maxDisplay = max.toFixed(6)

  return (
    <StyledBalanceInput {...props}>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text fontSize="14px">{title}</Text>
        <Text fontSize="14px">{TranslateString(999, `Balance: ${maxDisplay}`, { num: maxDisplay })}</Text>
      </Flex>
      <Flex alignItems="center">
        <Input onChange={onChange} placeholder="0" value={value} />
        {onSelectMax && (
          <Button scale="sm" onClick={onSelectMax} mr="8px">
            {TranslateString(452, 'Max')}
          </Button>
        )}
        <TokenSymbol title={symbol}>{symbol}</TokenSymbol>
      </Flex>
    </StyledBalanceInput>
  )
}

export default BalanceInput
