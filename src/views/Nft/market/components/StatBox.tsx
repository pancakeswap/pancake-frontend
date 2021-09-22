import React from 'react'
import styled from 'styled-components'
import { Box, BoxProps, Flex, Skeleton, Text } from '@pancakeswap/uikit'

export interface StatBoxItemProps extends BoxProps {
  title: string
  stat: string
}

export const StatBoxItem: React.FC<StatBoxItemProps> = ({ title, stat, ...props }) => (
  <Box {...props}>
    <Text fontSize="12px" color="textSubtle" textAlign="center">
      {title}
    </Text>
    {stat === null ? (
      <Skeleton height="24px" width="50%" mx="auto" />
    ) : (
      <Text fontWeight="600" textAlign="center">
        {stat}
      </Text>
    )}
  </Box>
)

const StatBox = styled(Flex)`
  align-items: center;
  background: ${({ theme }) => theme.colors.invertedContrast};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  justify-content: space-around;
  padding: 8px;
  width: 100%;
`

export default StatBox
