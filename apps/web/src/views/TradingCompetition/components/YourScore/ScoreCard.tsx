import { ReactNode, useCallback } from 'react'
import { styled } from 'styled-components'
import { StaticImageData } from 'next/dist/client/legacy/image'
import {
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
} from '@pancakeswap/uikit'
import { CLAIM, OVER } from 'config/constants/trading-competition/phases'
import ConnectWalletButton from 'components/ConnectWalletButton'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/chains'
import ClaimModal from '../ClaimModal'
import CardUserInfo from './CardUserInfo'
import ShareImageModal from '../ShareImageModal'
import { YourScoreProps } from '../../types'

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

interface ScoreCardProps extends YourScoreProps {
  userPrizeGrid: ReactNode
  flippersShareImage: StaticImageData
  stormShareImage: StaticImageData
  cakersShareImage: StaticImageData
  extraUserRankBox?: ReactNode
  subgraph?: string
}

const ScoreCard: React.FC<React.PropsWithChildren<ScoreCardProps>> = ({
  userPrizeGrid,
  extraUserRankBox,
  flippersShareImage,
  stormShareImage,
  cakersShareImage,
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
  subgraph,
}) => {
  const { t } = useTranslation()
  const [onPresentClaimModal] = useModal(
    <ClaimModal userTradingInformation={userTradingInformation} onClaimSuccess={onClaimSuccess} />,
    false,
  )
  const handleOnClick = useCallback(() => onPresentClaimModal?.(), [onPresentClaimModal])

  const isClaimButtonDisabled = Boolean(isLoading || finishedAndPrizesClaimed || finishedAndNothingToClaim)
  const { hasUserClaimed } = userTradingInformation as any

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
                <ShareImageModal
                  flippersShareImage={flippersShareImage}
                  cakersShareImage={cakersShareImage}
                  stormShareImage={stormShareImage}
                  profile={profile}
                  userLeaderboardInformation={userLeaderboardInformation}
                />
              }
              extraUserRankBox={extraUserRankBox}
              hasRegistered={hasRegistered}
              account={account}
              profile={profile}
              userLeaderboardInformation={userLeaderboardInformation}
              currentPhase={currentPhase}
            />
            {hasRegistered && (currentPhase?.state === CLAIM || currentPhase?.state === OVER) && userPrizeGrid}
            {!account && (
              <Flex mt="24px" justifyContent="center">
                <ConnectWalletButton />
              </Flex>
            )}
          </>
        )}
      </CardBody>
      {hasRegistered && currentPhase?.state === CLAIM && (
        <StyledCardFooter>
          <LaurelLeftIcon />
          <StyledButton disabled={isClaimButtonDisabled} mx="18px" onClick={handleOnClick}>
            {getClaimButtonText()}
          </StyledButton>
          <LaurelRightIcon />
        </StyledCardFooter>
      )}
      {subgraph && hasRegistered && (
        <Flex p="16px" justifyContent="flex-end">
          <SubgraphHealthIndicator
            chainId={ChainId.BSC}
            subgraph={subgraph}
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

export default ScoreCard
