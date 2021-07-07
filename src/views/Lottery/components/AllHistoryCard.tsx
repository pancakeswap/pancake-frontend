import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Text, CardFooter, Flex, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { WhiteBunny } from '../svgs'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.xs} {
    min-width: 320px;
  }
`

const StyledCardBody = styled(CardBody)`
  min-height: 240px;
`

const YourHistoryCard = () => {
  const { t } = useTranslation()

  return (
    <StyledCard>
      <StyledCardBody>
        <Flex minHeight="inherit" flexDirection="column" alignItems="center" justifyContent="center">
          <WhiteBunny height="50px" width="50px" mb="8px" />
          <Heading scale="md" textAlign="center">
            {t('Coming soon!')}
          </Heading>
        </Flex>
      </StyledCardBody>
      <CardFooter>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Text fontSize="12px" color="textSubtle">
            {t('Only showing data for Lottery V2')}
          </Text>
        </Flex>
      </CardFooter>
    </StyledCard>
  )
}

export default YourHistoryCard
