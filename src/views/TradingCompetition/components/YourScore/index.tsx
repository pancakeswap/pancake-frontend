import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import ScoreCard from './ScoreCard'
import ScoreHeading from './ScoreHeading'
import Ribbon from '../Ribbon'
import { YourScoreProps } from '../../types'

const Wrapper = styled.div`
  margin: 24px auto 0;
  max-width: 680px;
`

const YourScore: React.FC<YourScoreProps> = ({ registered = false, account, profile }) => {
  return (
    <Wrapper>
      {registered && <ScoreHeading profile={profile} />}
      <Flex alignItems="center" justifyContent="center">
        <Ribbon>Some text woah ooah woah</Ribbon>
      </Flex>
      <ScoreCard registered={registered} account={account} profile={profile} />
    </Wrapper>
  )
}

export default YourScore
