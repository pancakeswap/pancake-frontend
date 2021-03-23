import React from 'react'
import { Flex, Text, Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Heading1Text, Heading2Text } from '../CompetitionHeadingText'

const BattleBanner = () => {
  const TranslateString = useI18n()
  return (
    <Flex flexDirection="column">
      <Text mb="16px" color="textSubtle" fontWeight="bold">
        {TranslateString(999, 'April')} 07—14, 2020
      </Text>
      <Heading1Text>{TranslateString(999, 'Easter Battle')}</Heading1Text>
      <Heading2Text background="linear-gradient(180deg, #FFD800 0%, #EB8C00 100%)" fill>
        {TranslateString(999, '$200,000 in Prizes!')}
      </Heading2Text>
      <Heading size="md" color="inputSecondary" mt="16px">
        {TranslateString(999, 'Compete with other teams for the highest trading volume!')}
      </Heading>
    </Flex>
  )
}

export default BattleBanner
