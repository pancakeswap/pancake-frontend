import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { ArrowForwardIcon, Flex, FlexProps, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { PositionType } from './types'

interface LabelProps extends FlexProps {
  bg: string
  startIcon?: ReactNode
}

const StyledLabel = styled(Flex)<{ bg: LabelProps['bg'] }>`
  background-color: ${({ bg, theme }) => theme.colors[bg]};
  display: inline-flex;
`

const Label: React.FC<LabelProps> = ({ bg = 'success', startIcon, children, ...props }) => {
  const icon = startIcon || <ArrowForwardIcon color="currentColor" />

  return (
    <StyledLabel alignItems="center" justifyContent="center" borderRadius="4px" bg={bg} py="4px" px="8px" {...props}>
      {icon}
      <Text textTransform="uppercase" color="white" ml="4px">
        {children}
      </Text>
    </StyledLabel>
  )
}

interface PositionLabelProps extends FlexProps {
  enteredPosition: PositionType
}

export const PositionLabel: React.FC<PositionLabelProps> = ({ enteredPosition, ...props }) => {
  const TranslateString = useI18n()
  const icon = <ArrowForwardIcon color="white" />

  return (
    <Label bg={enteredPosition === PositionType.UP ? 'success' : 'failure'} startIcon={icon} {...props}>
      {enteredPosition === PositionType.UP ? TranslateString(999, 'Up') : TranslateString(999, 'Down')}
    </Label>
  )
}

export default Label
