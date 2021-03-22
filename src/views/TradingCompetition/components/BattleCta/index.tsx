import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Flex } from '@pancakeswap-libs/uikit'
import { Heading2Text } from '../CompetitionHeadingText'

const StyledCard = styled(Card)`
  display: inline-flex;
`

const BattleCta = () => {
  return (
    <StyledCard>
      <CardBody>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Heading2Text>Starting Soon</Heading2Text>
        </Flex>
      </CardBody>
    </StyledCard>
  )
}

export default BattleCta
