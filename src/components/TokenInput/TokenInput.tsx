import React from 'react'
import styled from 'styled-components'
import { Button, Input, InputProps } from '@pancakeswap-libs/uikit'
import useI18n from '../../hooks/useI18n'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  value: string
  onSelectMax?: () => void
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

const TokenInput: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value }) => {
  const TranslateString = useI18n()
  return (
    <StyledTokenInput>
      <StyledMaxText>
        {max.toLocaleString()} {symbol} {TranslateString(526, 'Available')}
      </StyledMaxText>
      <StyledInputWrapper>
        <Input onChange={onChange} placeholder="0" value={value} />
        <StyledTokenAdornmentWrapper>
          <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
          <StyledSpacer />
          <div>
            <Button size="sm" onClick={onSelectMax}>
              {TranslateString(452, 'Max')}
            </Button>
          </div>
        </StyledTokenAdornmentWrapper>
      </StyledInputWrapper>
    </StyledTokenInput>
  )
}

const StyledInputWrapper = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.colors.input};
  border-radius: ${(props) => props.theme.radii.default};
  display: flex;
  height: 72px;
  padding: 0 ${(props) => props.theme.spacing[3]}px;
`

const StyledTokenInput = styled.div``

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

export default TokenInput
