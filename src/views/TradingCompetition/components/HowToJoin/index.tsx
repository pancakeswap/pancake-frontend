import React from 'react'
import { Flex, Text, Heading, Link } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import HowToCard from './HowToCard'

const StyledLink = styled(Link)`
  display: inline;
  font-size: 14px;
`

const HowToJoin = () => {
  const TranslateString = useI18n()

  return (
    <Flex flexDirection="column" maxWidth="736px">
      <Heading color="secondary" size="lg" mb="32px" textAlign="center">
        {TranslateString(999, 'How Can I Join?')}
      </Heading>
      <HowToCard number={1} title={TranslateString(999, 'Get Ready')}>
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(999, 'Set up your')}{' '}
          <StyledLink href="/profile">{TranslateString(999, 'Pancake Profile')}</StyledLink>
          {', '}
          {TranslateString(999, 'then register for the competition by clicking the “I WANT TO BATTLE” button above.')}
        </Text>
      </HowToCard>
      <HowToCard number={2} title={TranslateString(999, 'Battle Time')}>
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(
            999,
            'Trade BNB/BUSD, CAKE/BNB, ETH/BNB and BTCB/BNB during the battle period to raise both your and your team’s score. See the Rules section below for more.',
          )}
        </Text>
      </HowToCard>
      <HowToCard number={3} title={TranslateString(999, 'Prize Claim')}>
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(
            999,
            'Teams and traders will be ranked in order of trading volume. Collect your prizes and celebrate!',
          )}
        </Text>
      </HowToCard>
    </Flex>
  )
}

export default HowToJoin
