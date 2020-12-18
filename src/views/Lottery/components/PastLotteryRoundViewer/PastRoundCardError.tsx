import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const StyledText = styled(Text)`
  padding: ${(props) => props.theme.spacing[4]}px;
`

const PastRoundCardError = ({ error, data }) => {
  const TranslateString = useI18n()

  return <StyledText>{error.message}</StyledText>
}

export default PastRoundCardError
