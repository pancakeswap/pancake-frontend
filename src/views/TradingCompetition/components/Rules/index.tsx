import React from 'react'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import RulesCard from './RulesCard'

const Rules = () => {
  const TranslateString = useI18n()

  return (
    <Flex flexDirection="column">
      <RulesCard title={TranslateString(999, 'Trade to increase your rank')}>
        <Text textAlign="center" fontSize="14px" color="textSubtle">
          {TranslateString(999, 'Eligible pairs: CAKE-BNB, ABC-DEF, GHI-JKL, MNO-PQRS')}
        </Text>
      </RulesCard>
      <RulesCard title={TranslateString(999, 'Play as a team')}>
        <Text textAlign="center" fontSize="14px" color="textSubtle">
          {TranslateString(999, 'The higher your team’s rank, the better your prizes!')}
        </Text>
      </RulesCard>
      <RulesCard title={TranslateString(999, 'Everyone’s a winner!')}>
        <Text textAlign="center" fontSize="14px" color="textSubtle">
          {TranslateString(999, 'Trade the minimum amount required and you’re guaranteed a prize!')}
        </Text>
      </RulesCard>
    </Flex>
  )
}

export default Rules
