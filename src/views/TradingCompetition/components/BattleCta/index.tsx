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
import RegisterModal from '../RegisterModal'
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

const BattleCta: React.FC<CompetitionProps> = ({
  userTradingStats,
  account,
  isCompetitionLive,
  profile,
  isLoading,
  hasCompetitionFinished,
}) => {
  const TranslateString = useI18n()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)
  const [onPresentRegisterModal] = useModal(<RegisterModal profile={profile} />, false)

  const { hasRegistered, hasClaimed } = userTradingStats

  const getButtonText = () => {
    // No wallet connected
    if (!account) {
      return TranslateString(999, 'Connect Wallet')
    }

    // User not registered
    if (!hasRegistered) {
      return TranslateString(999, 'Register Now!')
    }

    if (hasRegistered) {
      // User registered but competition has not started
      if (!isCompetitionLive) {
        return (
          <>
            <CheckmarkCircleIcon /> {TranslateString(999, 'Registered!')}
          </>
        )
      }

      // User registered and competition live
      if (isCompetitionLive) {
        return TranslateString(999, 'Trade Now')
      }
    }

    // May be useful for debugging - if somehow none of the above conditions are met
    return 'Error'
  }

  const handleCtaClick = () => {
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
  }

  const isButtonDisabled = () => isLoading || (hasRegistered && !isCompetitionLive)

  return (
    <StyledCard>
      <CardBody>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Heading2Text>
            {isCompetitionLive ? TranslateString(999, 'Now Live!') : TranslateString(999, 'Starting Soon')}
          </Heading2Text>
          <Flex alignItems="flex-end">
            <LaurelLeftIcon />
            <StyledButton disabled={isButtonDisabled()} onClick={() => handleCtaClick()}>
              {getButtonText()}
            </StyledButton>
            <LaurelRightIcon />
          </Flex>
        </Flex>
      </CardBody>
    </StyledCard>
  )
}

export default BattleCta
