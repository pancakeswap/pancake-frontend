import { Box, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import React from 'react'
import styled from 'styled-components'

interface FilterHeaderProps {
  title: string
}

const StyledFilterHeader = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
  border-radius: 24px 24px 0 0;
`

const FilterHeader: React.FC<FilterHeaderProps> = ({ title, children, ...props }) => {
  const { isMobile } = useMatchBreakpoints()

  if (isMobile) {
    return null
  }

  return (
    <StyledFilterHeader alignItems="center" justifyContent="space-between" p="16px" {...props}>
      <Text fontWeight="600">{title}</Text>
      {children && <Box>{children}</Box>}
    </StyledFilterHeader>
  )
}

export default FilterHeader
