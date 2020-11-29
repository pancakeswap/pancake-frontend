import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Inner = styled.div`
  display: flex;
  align-items: center;
`
const Image = styled.img`
  margin-right: 20px;
`

const NoPrizesContent: React.FC = () => {
  const TranslateString = useI18n()

  return (
    <Inner>
      <Image src="/images/no-prize.svg" alt="no prizes won" />
      <Text color="textDisabled">{TranslateString(999, 'Sorry, no prizes to collect')}</Text>
    </Inner>
  )
}

export default NoPrizesContent
