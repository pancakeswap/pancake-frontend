import React from 'react'
import { Box, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const BaseLabel = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
`

export const Label = styled(BaseLabel)`
  font-size: 20px;
`

export const SecondaryLabel = styled(BaseLabel)`
  font-size: 12px;
  text-transform: uppercase;
`

export const FormError: React.FC = ({ children }) => (
  <Text color="failure" mb="4px">
    {children}
  </Text>
)

export const FormErrors: React.FC<{ errors: string[] }> = ({ errors }) => {
  return (
    <Box mt="8px">
      {errors.map((error) => {
        return <FormError key={error}>{error}</FormError>
      })}
    </Box>
  )
}
