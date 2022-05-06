import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import ScoreHeader from '../../../components/YourScore/ScoreHeader'
import RibbonWithImage from '../../../components/RibbonWithImage'
import { YourScoreProps } from '../../../types'
import MoboxScoreCard from './MoboxScoreCard'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 24px auto 0;
  max-width: 768px;
`

const MoboxYourScore: React.FC<YourScoreProps> = ({
  hasRegistered = false,
  account,
  userTradingInformation,
  profile,
  isLoading,
  userLeaderboardInformation,
  currentPhase,
  userCanClaimPrizes,
  finishedAndPrizesClaimed,
  finishedAndNothingToClaim,
  onClaimSuccess,
}) => {
  const { t } = useTranslation()
  const showRibbon = !account || hasRegistered

  return (
    <Wrapper>
      {showRibbon && (
        <RibbonWithImage
          imageComponent={<ScoreHeader profile={profile} isLoading={isLoading} />}
          ribbonDirection="down"
          isCardHeader
        >
          {t('Your Score')}
        </RibbonWithImage>
      )}
      <MoboxScoreCard
        hasRegistered={hasRegistered}
        account={account}
        userTradingInformation={userTradingInformation}
        profile={profile}
        isLoading={isLoading}
        userLeaderboardInformation={userLeaderboardInformation}
        currentPhase={currentPhase}
        userCanClaimPrizes={userCanClaimPrizes}
        finishedAndPrizesClaimed={finishedAndPrizesClaimed}
        finishedAndNothingToClaim={finishedAndNothingToClaim}
        onClaimSuccess={onClaimSuccess}
      />
    </Wrapper>
  )
}

export default MoboxYourScore
