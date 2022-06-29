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
  Text,
  Box,
  TwitterIcon,
} from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { FINISHED, OVER } from 'config/constants/trading-competition/phases'
import { useRouter } from 'next/router'
import RegisterModal from '../RegisterModal'
import ClaimModal from '../ClaimModal'
import { Heading2Text } from '../CompetitionHeadingText'
import { CompetitionProps } from '../../types'

const StyledCard = styled(Card)`
  display: inline-flex;
  position: relative;
  overflow: visible;
  background: linear-gradient(180deg, #7645d9 0%, #452a7a 100%);

  > div {
    background: transparent;
  }

  .text-decorator {
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
  padding: 0px 10px;
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
  coinDecoration = null,
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)
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
      return t('Now Live!')
    }
    // Competition finished. Rewards being calculated
    if (currentPhase.state === FINISHED) {
      return `${t('Calculating')}...`
    }
    // All competition finished states
    if (hasCompetitionEnded) {
      return `${t('Finished')}!`
    }
    // Competition not started
    return t('Starting Soon')
  }

  const getButtonText = () => {
    // No wallet connected
    if (!account) {
      return t('Connect Wallet')
    }
    // User not registered
    if (!hasRegistered) {
      return t('I want to Battle!')
    }
    // User registered and competition live
    if (isCompetitionLive) {
      return t('Trade Now')
    }

    // User registered and competition finished
    if (hasCompetitionEnded) {
      // Claim period has ended
      if (currentPhase.state === OVER) {
        return t('Claim period over')
      }
      // User has prizes to claim
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

    // User registered but competition has not started
    if (!isCompetitionLive) {
      return (
        <>
          <CheckmarkCircleIcon /> {t('Registered!')}
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
      router.push('/swap')
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
          <Flex alignItems="flex-end">
            <LaurelLeftIcon className="text-decorator" />
            <StyledHeadingText>{getHeadingText()}</StyledHeadingText>
            <LaurelRightIcon className="text-decorator" />
          </Flex>
          {/* Hide button if in the pre-claim, FINISHED phase */}
          {currentPhase.state === FINISHED && (
            <Box width="280px" p="20px 0px 0px">
              {/* {inputSecondary can't fit this case} */}
              {/* <Text color="#D7CAEC">
                {t('Prizes will be announced and available for claiming at ~')}{' '}
                {new Date(Date.UTC(2022, 4, 26, 8)).toLocaleString('en-US', options)}
              </Text> */}
              <Text color="#D7CAEC">
                {t(
                  'Currently facing technical issues while configuring prize claiming. Prizes will be available for claiming once the issue is resolved. Follow our social channels for latest updates.',
                )}
              </Text>
              <Text textAlign="center" pt="20px">
                <Button
                  scale="sm"
                  variant="secondary"
                  onClick={() => {
                    window.open('https://twitter.com/pancakeswap', '_blank', 'noopener noreferrer')
                  }}
                >
                  <TwitterIcon color="textSubtle" fontSize="12px" mr="5px" />
                  {t('Follow Update')}
                </Button>
              </Text>
            </Box>
          )}
          {currentPhase.state !== FINISHED && (
            <Flex alignItems="flex-end">
              <StyledButton disabled={isButtonDisabled} onClick={() => handleCtaClick()}>
                {getButtonText()}
              </StyledButton>
            </Flex>
          )}
        </Flex>
      </CardBody>
      {coinDecoration}
    </StyledCard>
  )
}

export default BattleCta
