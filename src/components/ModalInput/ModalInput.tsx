import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link } from '@pancakeswap-libs/uikit'
import useI18n from '../../hooks/useI18n'

interface ModalInputProps {
  max: number | string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  withdrawal?: boolean
}

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
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
  padding: 8px 16px 8px 0;
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  width: auto;
  margin: 0 8px;
  padding: 0 8px;
`

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  withdrawal,
}) => {
  const TranslateString = useI18n()
  const isBalanceZero = max === '0' || !max

  // debugger // eslint-disable-line no-debugger

  return (
    <div style={{ position: 'relative' }}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex justifyContent="space-between" pl="16px">
          <Text fontSize="14px">{withdrawal ? TranslateString(999, 'Unstake') : TranslateString(999, 'Stake')}</Text>
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
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="failure">
          No tokens to stake:{' '}
          <Link fontSize="14px" bold={false} href={addLiquidityUrl} external color="failure">
            {TranslateString(999, 'get')} {symbol}
          </Link>
        </StyledErrorMessage>
      )}
    </div>
  )
}

export default ModalInput
