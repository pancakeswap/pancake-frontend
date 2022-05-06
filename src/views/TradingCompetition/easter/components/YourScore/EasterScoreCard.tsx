import styled from 'styled-components'
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
import { useTranslation } from 'contexts/Localization'
import ClaimModal from '../../../components/ClaimModal'
import { YourScoreProps } from '../../../types'
import EasterUserPrizeGrid from './EasterUserPrizeGrid'
import CardUserInfo from '../../../components/YourScore/CardUserInfo'
import EasterShareImageModal from '../EasterShareImageModal'

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

const EasterScoreCard: React.FC<YourScoreProps> = ({
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
                <EasterShareImageModal profile={profile} userLeaderboardInformation={userLeaderboardInformation} />
              }
              hasRegistered={hasRegistered}
              account={account}
              profile={profile}
              userLeaderboardInformation={userLeaderboardInformation}
              currentPhase={currentPhase}
            />
            {hasRegistered && (currentPhase.state === CLAIM || currentPhase.state === OVER) && (
              <EasterUserPrizeGrid userTradingInformation={userTradingInformation} />
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
    </StyledCard>
  )
}

export default EasterScoreCard
