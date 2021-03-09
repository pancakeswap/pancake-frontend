import React from 'react'
import styled from 'styled-components'
import { CheckmarkCircleIcon, Tag } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const StyledEnteredTag = styled(Tag).attrs({
  variant: 'secondary',
  startIcon: <CheckmarkCircleIcon width="18px" />,
})`
  font-weight: bold;
  text-transform: uppercase;
`

const EnteredTag = () => {
  const TranslateString = useI18n()

  return <StyledEnteredTag>{TranslateString(999, 'Entered')}</StyledEnteredTag>
}

export default EnteredTag
