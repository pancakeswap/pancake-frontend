import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { ArrowUpIcon, ArrowDownIcon, Flex, FlexProps, Text } from '@pancakeswap-libs/uikit'
import { Position } from 'state/types'

interface TagProps extends FlexProps {
  bg?: string
  startIcon?: ReactNode
}

const StyledTag = styled(Flex)<{ bg: TagProps['bg'] }>`
  background-color: ${({ bg, theme }) => theme.colors[bg]};
  display: inline-flex;
`

const Tag: React.FC<TagProps> = ({ bg = 'success', startIcon, children, ...props }) => {
  const icon = startIcon || <ArrowUpIcon color="white" />

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
  roundPosition: Position
}

export const PositionTag: React.FC<PositionTagProps> = ({ roundPosition, children, ...props }) => {
  const isUpPosition = roundPosition === Position.UP
  const icon = isUpPosition ? <ArrowUpIcon color="white" /> : <ArrowDownIcon color="white" />

  return (
    <Tag bg={isUpPosition ? 'success' : 'failure'} startIcon={icon} {...props}>
      {children}
    </Tag>
  )
}

export default Tag
