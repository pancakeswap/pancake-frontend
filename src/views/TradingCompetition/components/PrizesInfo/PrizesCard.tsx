import React from 'react'
import styled from 'styled-components'
import { Card, CardHeader, Box, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import PrizesGrid from './PrizesGrid'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 40px;
    flex: 1;
  }
`

const PrizesCard = () => {
  const TranslateString = useI18n()

  return (
    <StyledCard>
      <CardHeader>
        <Heading size="lg" color="secondary">
          {TranslateString(999, 'Prizes by Team')}
        </Heading>
        <Text color="textSubtle" fontSize="14px">
          {TranslateString(999, 'Higher trading volume = higher rank!')}
        </Text>
      </CardHeader>
      <PrizesGrid />
      <Box p="24px">
        <Text color="textSubtle" fontSize="14px">
          {TranslateString(
            999,
            'Prizes to be distributed in CAKE and shared by all members of a tier. CAKE price in USD to be determined on the day of distribution. Details below.',
          )}
        </Text>
      </Box>
    </StyledCard>
  )
}

export default PrizesCard
