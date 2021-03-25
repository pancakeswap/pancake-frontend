import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import HowToCard from './HowToCard'

const HowToJoin = () => {
  const TranslateString = useI18n()

  return (
    <Flex flexDirection="column">
      <Heading color="secondary" size="lg" mb="32px" textAlign="center">
        How Can I Join?
      </Heading>
      <HowToCard number={1} title={TranslateString(999, 'Entry Period')}>
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(
            999,
            'Set up your Pancake Profile to join a team, then register for the competition via the button above',
          )}
        </Text>
      </HowToCard>
      <HowToCard number={2} title={TranslateString(1198, 'Live')}>
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(
            999,
            'Trading on certain pairs during the competition will raise your score and your team’s score.',
          )}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(999, 'See the Rules section below for more.')}
        </Text>
      </HowToCard>
      <HowToCard number={3} title={TranslateString(1198, 'End')}>
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
