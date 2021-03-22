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
} from '@pancakeswap-libs/uikit'
import useAuth from 'hooks/useAuth'
import useI18n from 'hooks/useI18n'
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

const BattleCta: React.FC<CompetitionProps> = ({ registered, account, isCompetitionLive }) => {
  const TranslateString = useI18n()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  const getButtonText = () => {
    if (!account) {
      return TranslateString(999, 'Connect Wallet')
    }

    if (!registered) {
      return TranslateString(999, 'Register Now!')
    }

    if (registered && !isCompetitionLive) {
      return (
        <>
          <CheckmarkCircleIcon /> {TranslateString(999, 'Registered!')}
        </>
      )
    }

    if (registered && isCompetitionLive) {
      return TranslateString(999, 'Trade Now')
    }

    return ''
  }

  const handleCtaClick = () => {
    if (!account) {
      onPresentConnectModal()
    }

    if (!registered) {
      // registerModal
    }

    if (registered && isCompetitionLive) {
      // push to exchange
    }

    return ''
  }

  return (
    <StyledCard>
      <CardBody>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Heading2Text>
            {isCompetitionLive ? TranslateString(999, 'Now Live!') : TranslateString(999, 'Starting Soon')}
          </Heading2Text>
          <Flex alignItems="flex-end">
            <LaurelLeftIcon />
            <StyledButton disabled={registered && !isCompetitionLive} onClick={() => handleCtaClick()}>
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
