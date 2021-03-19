import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import ScoreCard from './ScoreCard'
import ScoreProfile from './ScoreProfile'
import RibbonWithImage from '../RibbonWithImage'
import { YourScoreProps } from '../../types'

const Wrapper = styled.div`
  position: relative;
  margin: 24px auto 0;
  max-width: 680px;
`

const HeaderWrapper = styled.div``

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
        <RibbonWithImage imageComponent={<ScoreProfile profile={profile} />} ribbonDirection="down" isCardHeader>
          Your Score
        </RibbonWithImage>
      )}
      <ScoreCardWrapper>
        <ScoreCard registered={registered} account={account} profile={profile} />
      </ScoreCardWrapper>
    </Wrapper>
  )
}

export default YourScore
