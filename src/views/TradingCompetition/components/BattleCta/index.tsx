import React from 'react'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Flex,
  LaurelLeftIcon,
  LaurelRightIcon,
  Button,
  CheckmarkCircleIcon,
  useWalletModal,
  useModal,
} from '@pancakeswap-libs/uikit'
import useAuth from 'hooks/useAuth'
import useI18n from 'hooks/useI18n'
import { FINISHED, OVER } from 'config/constants/trading-competition/easterPhases'
import RegisterModal from '../RegisterModal'
import ClaimModal from '../ClaimModal'
import { Heading2Text } from '../CompetitionHeadingText'
import { CompetitionProps } from '../../types'

const StyledCard = styled(Card)`
  display: inline-flex;
  background: linear-gradient(180deg, #7645d9 0%, #452a7a 100%);

  svg {
    margin-bottom: 6px;
    height: 32px;
    width: auto;
    fill: ${({ theme }) => theme.colors.warning};
  }
`

const StyledButton = styled(Button)`
  margin: 16px 20px 0;
  z-index: 200;

  svg {
    margin: 0 4px 0 0;
    height: 20px;
    width: auto;
    fill: ${({ theme }) => theme.colors.textDisabled};
  }
`

const StyledHeadingText = styled(Heading2Text)`
  white-space: normal;
`

const BattleCta: React.FC<CompetitionProps> = ({
  userTradingInformation,
  currentPhase,
  account,
  isCompetitionLive,
  profile,
  userCanClaimPrizes,
  finishedAndPrizesClaimed,
  finishedAndNothingToClaim,
  isLoading,
  hasCompetitionEnded,
  onRegisterSuccess,
  onClaimSuccess,
}) => {
  const TranslateString = useI18n()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)
  const [onPresentRegisterModal] = useModal(
    <RegisterModal profile={profile} onRegisterSuccess={onRegisterSuccess} />,
    false,
  )
  const [onPresentClaimModal] = useModal(
    <ClaimModal userTradingInformation={userTradingInformation} onClaimSuccess={onClaimSuccess} />,
    false,
  )
  const { hasRegistered, hasUserClaimed } = userTradingInformation
  const registeredAndNotStarted = hasRegistered && !isCompetitionLive && !hasCompetitionEnded

  const isButtonDisabled = Boolean(
    isLoading ||
      currentPhase.state === OVER ||
      registeredAndNotStarted ||
      finishedAndPrizesClaimed ||
      finishedAndNothingToClaim,
  )

  const getHeadingText = () => {
    // Competition live
    if (isCompetitionLive) {
      return TranslateString(999, 'Now Live!')
    }
    // Competition finished. Rewards being calculated
    if (currentPhase.state === FINISHED) {
      return `${TranslateString(999, 'Calculating prizes')}...`
    }
    // All competition finished states
    if (hasCompetitionEnded) {
      return `${TranslateString(388, 'Finished')}!`
    }
    // Competition not started
    return TranslateString(999, 'Starting Soon')
  }

  const getButtonText = () => {
    // No wallet connected
    if (!account) {
      return TranslateString(292, 'Unlock Wallet')
    }
    // User not registered
    if (!hasRegistered) {
      return TranslateString(999, 'I want to Battle!')
    }
    // User registered and competition live
    if (isCompetitionLive) {
      return TranslateString(999, 'Trade Now')
    }

    // User registered and competition finished
    if (hasCompetitionEnded) {
      // Claim period has ended
      if (currentPhase.state === OVER) {
        return TranslateString(999, 'Claim period over')
      }
      // User has prizes to claim
      if (userCanClaimPrizes) {
        return TranslateString(999, 'Claim prizes')
      }
      // User has already claimed prizes
      if (hasUserClaimed) {
        return (
          <>
            <CheckmarkCircleIcon /> {TranslateString(999, 'Prizes Claimed!')}
          </>
        )
      }
      // User has nothing to claim
      return TranslateString(999, 'Nothing to claim')
    }

    // User registered but competition has not started
    if (!isCompetitionLive) {
      return (
        <>
          <CheckmarkCircleIcon /> {TranslateString(999, 'Registered!')}
        </>
      )
    }

    // May be useful for debugging - if somehow none of the above conditions are met
    return 'Whoopsie'
  }

  const handleCtaClick = () => {
    // All conditions when button isn't disabled

    // No wallet connected
    if (!account) {
      onPresentConnectModal()
    }
    // Wallet connected but user not registered
    if (account && !hasRegistered) {
      onPresentRegisterModal()
    }
    // Registered and competition is live
    if (hasRegistered && isCompetitionLive) {
      window.location.href = 'https://exchange.pancakeswap.finance/#/swap'
    }
    // Registered and competition has finished
    if (hasRegistered && hasCompetitionEnded) {
      onPresentClaimModal()
    }
  }

  return (
    <StyledCard>
      <CardBody>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <StyledHeadingText>{getHeadingText()}</StyledHeadingText>
          {/* Hide button if in the pre-claim, FINISHED phase */}
          {currentPhase.state !== FINISHED && (
            <Flex alignItems="flex-end">
              <LaurelLeftIcon />
              <StyledButton disabled={isButtonDisabled} onClick={() => handleCtaClick()}>
                {getButtonText()}
              </StyledButton>
              <LaurelRightIcon />
            </Flex>
          )}
        </Flex>
      </CardBody>
    </StyledCard>
  )
}

export default BattleCta
