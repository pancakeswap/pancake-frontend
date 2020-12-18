import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'

const StyledText = styled(Text)`
  padding: ${(props) => props.theme.spacing[4]}px;
`

const PastRoundCardError = ({ error }) => {
  return <StyledText>{error.message}</StyledText>
}

export default PastRoundCardError
