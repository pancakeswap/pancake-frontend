import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, Flex } from '@pancakeswap-libs/uikit'
import useI18n from '../../hooks/useI18n'
import { InputProps } from '../Input'

interface ModalInputProps extends InputProps {
  max: number | string
  symbol: string
  onSelectMax?: () => void
}

const StyledTokenInput = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px;
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
`

const ModalInput: React.FC<ModalInputProps> = ({ max, symbol, onChange, onSelectMax, value }) => {
  const TranslateString = useI18n()
  return (
    <StyledTokenInput>
      <Flex justifyContent="space-between">
        <Text fontSize="14px">{TranslateString(999, 'Deposit')}</Text>
        <Text fontSize="14px">
          {TranslateString(999, 'Balance')}: {max.toLocaleString()}
        </Text>
      </Flex>
      <Flex>
        <StyledInput
          // endAdornment={
          //   <StyledTokenAdornmentWrapper>
          //     <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
          //     <StyledSpacer />
          //     <div>

          //     </div>
          //   </StyledTokenAdornmentWrapper>
          // }
          onChange={onChange}
          placeholder="0"
          value={value}
        />
        <Button size="sm" onClick={onSelectMax}>
          {TranslateString(452, 'Max')}
        </Button>
        <Text fontSize="16px">{symbol}</Text>
      </Flex>
    </StyledTokenInput>
  )
}

const StyledSpacer = styled.div`
  width: ${(props) => props.theme.spacing[3]}px;
`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`

const StyledMaxText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  justify-content: flex-end;
`

const StyledTokenSymbol = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 700;
`

export default ModalInput
