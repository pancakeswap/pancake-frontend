import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import ScoreCard from './ScoreCard'
import ScoreProfile from './ScoreProfile'
import RibbonWithImage from '../RibbonWithImage'
import { YourScoreProps } from '../../types'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 24px auto 0;
  max-width: 680px;
`

const ScoreCardWrapper = styled.div`
  margin-top: 24px;
`

const YourScore: React.FC<YourScoreProps> = ({ hasRegistered = false, account, profile }) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      {hasRegistered && (
        <RibbonWithImage imageComponent={<ScoreProfile profile={profile} />} ribbonDirection="down" isCardHeader>
          {TranslateString(999, 'Your Score')}
        </RibbonWithImage>
      )}
      <ScoreCardWrapper>
        <ScoreCard hasRegistered={hasRegistered} account={account} profile={profile} />
      </ScoreCardWrapper>
    </Wrapper>
  )
}

export default YourScore
