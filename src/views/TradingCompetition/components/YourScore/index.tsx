import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import ScoreCard from './ScoreCard'
import ScoreHeader from './ScoreHeader'
import RibbonWithImage from '../RibbonWithImage'
import { YourScoreProps } from '../../types'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 24px auto 0;
  max-width: 768px;
`

const YourScore: React.FC<YourScoreProps> = ({
  hasRegistered = false,
  account,
  profile,
  isLoading,
  userLeaderboardInformation,
  currentPhase,
}) => {
  const TranslateString = useI18n()
  const showRibbon = !account || hasRegistered

  return (
    <Wrapper>
      {showRibbon && (
        <RibbonWithImage
          imageComponent={<ScoreHeader profile={profile} isLoading={isLoading} />}
          ribbonDirection="down"
          isCardHeader
        >
          {TranslateString(1228, 'Your Score')}
        </RibbonWithImage>
      )}
      <ScoreCard
        hasRegistered={hasRegistered}
        account={account}
        profile={profile}
        isLoading={isLoading}
        userLeaderboardInformation={userLeaderboardInformation}
        currentPhase={currentPhase}
      />
    </Wrapper>
  )
}

export default YourScore
