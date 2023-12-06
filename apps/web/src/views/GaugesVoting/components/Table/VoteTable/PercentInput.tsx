import { BalanceInputProps, Box, Button, Flex, Text } from '@pancakeswap/uikit'
import { StyledBalanceInput, StyledInput as UIKitStyledInput } from '@pancakeswap/uikit/components/BalanceInput/styles'
import styled, { css } from 'styled-components'

export type PercentInputProps = Omit<BalanceInputProps, 'unit' | 'switchEditingUnits'> & {
  onMax?: () => void
  disabled?: boolean
}

const StyledInput = styled(UIKitStyledInput)`
  height: 20px;
  width: 35px;

  &:disabled {
    background-color: transparent;
  }
`

const StyledPercentInput = styled(StyledBalanceInput)`
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  gap: 12px;
`

const MaxButton = styled(Button)`
  border-radius: 8px;

  ${({ disabled }) =>
    disabled &&
    css`
      border-radius: 8px !important;
      border: 2px solid #bdc2c4 !important;
      background-color: transparent !important;
    `}
`

export const PercentInput: React.FC<PercentInputProps> = ({
  isWarning = false,
  decimals = 2,
  value,
  placeholder = '0',
  inputProps,
  innerRef,
  onUserInput,
  onMax,
  disabled,
  ...props
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      onUserInput(e.currentTarget.value.replace(/,/g, '.'))
    }
  }
  return (
    <StyledPercentInput isWarning={isWarning} {...props}>
      <Box>
        <Flex alignItems="center">
          <StyledInput
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode="decimal"
            min="0"
            max="100"
            value={value}
            onChange={handleOnChange}
            placeholder={placeholder}
            ref={innerRef}
            {...inputProps}
          />
          <Text color="textSubtle" ml={2}>
            %
          </Text>
        </Flex>
      </Box>
      <MaxButton disabled={disabled} variant="secondary" scale="xs" onClick={onMax}>
        MAX
      </MaxButton>
    </StyledPercentInput>
  )
}
