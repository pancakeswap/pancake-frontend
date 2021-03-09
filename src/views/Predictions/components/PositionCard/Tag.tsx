import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { ArrowForwardIcon, Flex, FlexProps, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { PositionType } from './types'

interface TagProps extends FlexProps {
  bg: string
  startIcon?: ReactNode
}

const StyledTag = styled(Flex)<{ bg: TagProps['bg'] }>`
  background-color: ${({ bg, theme }) => theme.colors[bg]};
  display: inline-flex;
`

const Tag: React.FC<TagProps> = ({ bg = 'success', startIcon, children, ...props }) => {
  const icon = startIcon || <ArrowForwardIcon color="currentColor" />

  return (
    <StyledTag alignItems="center" justifyContent="center" borderRadius="4px" bg={bg} py="4px" px="8px" {...props}>
      {icon}
      <Text textTransform="uppercase" color="white" ml="4px">
        {children}
      </Text>
    </StyledTag>
  )
}

interface PositionTagProps extends FlexProps {
  enteredPosition: PositionType
}

export const PositionTag: React.FC<PositionTagProps> = ({ enteredPosition, ...props }) => {
  const TranslateString = useI18n()
  const icon = <ArrowForwardIcon color="white" />

  return (
    <Tag bg={enteredPosition === PositionType.UP ? 'success' : 'failure'} startIcon={icon} {...props}>
      {enteredPosition === PositionType.UP ? TranslateString(999, 'Up') : TranslateString(999, 'Down')}
    </Tag>
  )
}

export default Tag
