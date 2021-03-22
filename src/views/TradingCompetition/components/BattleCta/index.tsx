import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Flex, LaurelLeftIcon, LaurelRightIcon, Button } from '@pancakeswap-libs/uikit'
import { Heading2Text } from '../CompetitionHeadingText'

const StyledCard = styled(Card)`
  display: inline-flex;
  background: linear-gradient(180deg, #7645d9 0%, #452a7a 100%);
  svg {
    z-index: 0;
  }
`

const StyledButton = styled(Button)`
  margin: 16px 20px 0;
`

const BattleCta = () => {
  return (
    <StyledCard>
      <CardBody>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Heading2Text>Starting Soon</Heading2Text>
          <Flex>
            <LaurelLeftIcon />
            <StyledButton>Sample</StyledButton>
            <LaurelRightIcon />
          </Flex>
        </Flex>
      </CardBody>
    </StyledCard>
  )
}

export default BattleCta
