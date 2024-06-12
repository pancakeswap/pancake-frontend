import { useTranslation } from '@pancakeswap/localization'
import { Heading, Skeleton, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

import { TC_MOBOX_SUBGRAPH } from 'config/constants/endpoints'

import { LIVE } from '../../../../../config/constants/trading-competition/phases'
import RibbonWithImage from '../../../components/RibbonWithImage'
import ScoreCard from '../../../components/YourScore/ScoreCard'
import ScoreHeader from '../../../components/YourScore/ScoreHeader'
import UserRankBox from '../../../components/YourScore/UserRankBox'
import CakersShare from '../../../pngs/mobox-cakers-share.png'
import FlippersShare from '../../../pngs/mobox-flippers-share.png'
import StormShare from '../../../pngs/mobox-storm-share.png'
import { YourScoreProps } from '../../../types'
import MoboxUserPrizeGrid from './MoboxUserPrizeGrid'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 24px auto 0;
  max-width: 768px;
`

const MoboxYourScore: React.FC<React.PropsWithChildren<YourScoreProps>> = ({
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
      <ScoreCard
        subgraph={TC_MOBOX_SUBGRAPH}
        userPrizeGrid={<MoboxUserPrizeGrid userTradingInformation={userTradingInformation} />}
        extraUserRankBox={
          <UserRankBox
            flex="2"
            title={t('Your MBOX volume rank').toUpperCase()}
            footer={t('Based on your MBOX/BNB and MBOX/BUSD trading')}
            // Add responsive mr if competition is LIVE
            mr={currentPhase?.state === LIVE ? [0, null, null, '8px'] : 0}
          >
            {!userLeaderboardInformation ? (
              <Skeleton height="26px" width="110px" />
            ) : (
              <>
                <Heading textAlign="center" scale="lg">
                  #{userLeaderboardInformation.moboxVolumeRank}
                </Heading>
                <Text>
                  $
                  {(userLeaderboardInformation.moboxVolume as unknown as number).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                  })}
                </Text>
              </>
            )}
          </UserRankBox>
        }
        flippersShareImage={FlippersShare}
        cakersShareImage={CakersShare}
        stormShareImage={StormShare}
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
