import styled from 'styled-components'
import {
  Text,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Skeleton,
  Button,
  LaurelLeftIcon,
  LaurelRightIcon,
  CheckmarkCircleIcon,
  useModal,
  Heading,
} from '@pancakeswap/uikit'
import { CLAIM, OVER, LIVE } from 'config/constants/trading-competition/phases'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import ClaimModal from '../../../components/ClaimModal'
import { YourScoreProps } from '../../../types'
import MoboxUserPrizeGrid from './MoboxUserPrizeGrid'
import MoboxShareImageModal from '../MoboxShareImageModal'
import CardUserInfo from '../../../components/YourScore/CardUserInfo'
import UserRankBox from '../../../components/YourScore/UserRankBox'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

const StyledCardFooter = styled(CardFooter)`
  background: ${({ theme }) => theme.card.cardHeaderBackground.default};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 32px;
    width: auto;
    fill: ${({ theme }) => theme.colors.warning};
  }
`

const StyledButton = styled(Button)`
  svg {
    margin-right: 4px;
    height: 20px;
    width: auto;
    fill: ${({ theme }) => theme.colors.textDisabled};
  }
`

const MoboxScoreCard: React.FC<YourScoreProps> = ({
  hasRegistered,
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
  const [onPresentClaimModal] = useModal(
    <ClaimModal userTradingInformation={userTradingInformation} onClaimSuccess={onClaimSuccess} />,
    false,
  )

  const isClaimButtonDisabled = Boolean(isLoading || finishedAndPrizesClaimed || finishedAndNothingToClaim)
  const { hasUserClaimed } = userTradingInformation

  const getClaimButtonText = () => {
    if (userCanClaimPrizes) {
      return t('Claim prizes')
    }
    // User has already claimed prizes
    if (hasUserClaimed) {
      return (
        <>
          <CheckmarkCircleIcon /> {t('Prizes Claimed!')}
        </>
      )
    }
    // User has nothing to claim
    return t('Nothing to claim')
  }

  return (
    <StyledCard mt="24px">
      <CardBody>
        {isLoading ? (
          <Flex mt="24px" justifyContent="center" alignItems="center">
            <Skeleton width="100%" height="60px" />
          </Flex>
        ) : (
          <>
            <CardUserInfo
              shareModal={
                <MoboxShareImageModal profile={profile} userLeaderboardInformation={userLeaderboardInformation} />
              }
              extraUserRankBox={
                <UserRankBox
                  flex="2"
                  title={t('Your MBOX volume rank').toUpperCase()}
                  footer={t('Based on your MBOX/BNB and MBOX/BUSD trading')}
                  // Add responsive mr if competition is LIVE
                  mr={currentPhase.state === LIVE ? [0, null, null, '8px'] : 0}
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
              hasRegistered={hasRegistered}
              account={account}
              profile={profile}
              userLeaderboardInformation={userLeaderboardInformation}
              currentPhase={currentPhase}
            />
            {hasRegistered && (currentPhase.state === CLAIM || currentPhase.state === OVER) && (
              <MoboxUserPrizeGrid userTradingInformation={userTradingInformation} />
            )}
            {!account && (
              <Flex mt="24px" justifyContent="center">
                <ConnectWalletButton />
              </Flex>
            )}
          </>
        )}
      </CardBody>
      {hasRegistered && currentPhase.state === CLAIM && (
        <StyledCardFooter>
          <LaurelLeftIcon />
          <StyledButton disabled={isClaimButtonDisabled} mx="18px" onClick={() => onPresentClaimModal()}>
            {getClaimButtonText()}
          </StyledButton>
          <LaurelRightIcon />
        </StyledCardFooter>
      )}
      {hasRegistered && (
        <Flex p="16px" justifyContent="flex-end">
          <SubgraphHealthIndicator
            subgraphName="pancakeswap/trading-competition-v3"
            inline
            obeyGlobalSetting={false}
            customDescriptions={{
              delayed: t(
                'Subgraph is currently experiencing delays due to BSC issues. Rank and volume data may be inaccurate until subgraph is restored.',
              ),
              slow: t(
                'Subgraph is currently experiencing delays due to BSC issues. Rank and volume data may be inaccurate until subgraph is restored.',
              ),
              healthy: t('No issues with the subgraph.'),
            }}
          />
        </Flex>
      )}
    </StyledCard>
  )
}

export default MoboxScoreCard
