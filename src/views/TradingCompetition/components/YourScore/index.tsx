import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import ScoreCard from './ScoreCard'
import ScoreHeader from './ScoreHeader'
import Ribbon from '../Ribbon'
import { YourScoreProps } from '../../types'

const Wrapper = styled.div`
  position: relative;
  margin: 24px auto 0;
  max-width: 680px;
`

const HeadingWrapper = styled.div`
  padding-bottom: 4px;
`

const RibbonWrapper = styled(Flex)`
  position: absolute;
  width: 100%;
  z-index: 1;
  left: 50%;
  top: 128px;
  transform: translate(-50%, 0);
`

const ScoreCardWrapper = styled.div`
  margin-top: 24px;
`

const YourScore: React.FC<YourScoreProps> = ({ registered = false, account, profile }) => {
  return (
    <Wrapper>
      {registered && (
        <>
          <HeadingWrapper>
            <ScoreHeader profile={profile} />
          </HeadingWrapper>
          <RibbonWrapper alignItems="center" justifyContent="center">
            <Ribbon>Some text woah ooah woah</Ribbon>
          </RibbonWrapper>
        </>
      )}

      <ScoreCardWrapper>
        <ScoreCard registered={registered} account={account} profile={profile} />
      </ScoreCardWrapper>
    </Wrapper>
  )
}

export default YourScore
