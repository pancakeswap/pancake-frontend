import React, { useState } from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Wrapper = styled.div`
  margin-bottom: 24px;
`

const PastLotterySearcher = () => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <Text>Select lottery number:</Text>
    </Wrapper>
  )
}

export default PastLotterySearcher
