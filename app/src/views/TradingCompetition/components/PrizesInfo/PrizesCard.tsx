import React from 'react'
import styled from 'styled-components'
import { Card, CardHeader, Box, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import PrizesGrid from './PrizesGrid'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 40px;
    flex: 1;
  }
`

const PrizesCard = () => {
  const { t } = useTranslation()

  return (
    <StyledCard>
      <CardHeader>
        <Heading scale="lg" color="secondary">
          {t('Prizes by Team')}
        </Heading>
        <Text color="textSubtle" fontSize="14px">
          {t('Higher trading volume = higher rank!')}
        </Text>
      </CardHeader>
      <PrizesGrid />
      <Box p="24px">
        <Text color="textSubtle" fontSize="14px">
          {t(
            'Prizes to be distributed in CAKE, LAZIO, PORTO and SANTOS in a distribution of 3:1:1:1 and shared by all members of each respective tier.',
          )}{' '}
          {t(
            'The price of token prizes (CAKE, LAZIO, PORTO and SANTOS) in USD will be determined as per their BUSD pair price during the tally period.',
          )}
        </Text>
      </Box>
    </StyledCard>
  )
}

export default PrizesCard
