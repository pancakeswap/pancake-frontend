import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Flex, LaurelLeftIcon, LaurelRightIcon, Button } from '@pancakeswap-libs/uikit'
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
`

const BattleCta: React.FC<CompetitionProps> = ({ registered, account, isCompetitionLive }) => {
  const TranslateString = useI18n()

  const handleCtaClick = () => {
    console.log('clicked')
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
            <StyledButton onClick={() => handleCtaClick()}>Sample</StyledButton>
            <LaurelRightIcon />
          </Flex>
        </Flex>
      </CardBody>
    </StyledCard>
  )
}

export default BattleCta
