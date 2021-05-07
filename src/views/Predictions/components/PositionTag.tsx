import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { ArrowUpIcon, ArrowDownIcon, Flex, FlexProps, Text } from '@pancakeswap/uikit'
import { BetPosition } from 'state/types'

interface TagProps extends FlexProps {
  bg?: string
  startIcon?: ReactNode
}

const StyledTag = styled(Flex)<{ bg: TagProps['bg'] }>`
  background-color: ${({ bg, theme }) => theme.colors[bg]};
  display: inline-flex;
`

export const Tag: React.FC<TagProps> = ({ bg = 'success', startIcon, children, onClick, ...props }) => {
  const icon = startIcon || <ArrowUpIcon color="white" />

  return (
    <StyledTag
      alignItems="center"
      justifyContent="center"
      borderRadius="4px"
      bg={bg}
      py="4px"
      px="8px"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'normal' }}
      {...props}
    >
      {icon}
      <Text textTransform="uppercase" color="white" ml="4px">
        {children}
      </Text>
    </StyledTag>
  )
}

interface PositionTagProps extends FlexProps {
  betPosition: BetPosition
}

const PositionTag: React.FC<PositionTagProps> = ({ betPosition, children, ...props }) => {
  const isUpPosition = betPosition === BetPosition.BULL
  const icon = isUpPosition ? <ArrowUpIcon color="white" /> : <ArrowDownIcon color="white" />

  return (
    <Tag bg={isUpPosition ? 'success' : 'failure'} startIcon={icon} {...props}>
      {children}
    </Tag>
  )
}

export default PositionTag
