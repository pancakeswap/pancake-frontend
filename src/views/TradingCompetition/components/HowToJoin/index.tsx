import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import HowToCard from './HowToCard'

const HowToJoin = () => {
  const TranslateString = useI18n()

  return (
    <Flex flexDirection="column">
      <HowToCard number={1} title={TranslateString(999, 'Entry Period')}>
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(
            999,
            'Set up your Pancake Profile to join a team, then register for the competition via the button above',
          )}
        </Text>
      </HowToCard>
    </Flex>
  )
}

export default HowToJoin
