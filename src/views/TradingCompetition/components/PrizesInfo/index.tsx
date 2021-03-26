import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import PrizesText from './PrizesText'
import PrizesTable from './PrizesTable'

const Wrapper = styled(Flex)`
  max-width: 736px;
  flex-direction: column-reverse;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`

const HowToJoin = () => {
  const TranslateString = useI18n()

  return (
    <Wrapper flexDirection="column" maxWidth="736px">
      <PrizesTable />
      <PrizesText />
    </Wrapper>
  )
}

export default HowToJoin
