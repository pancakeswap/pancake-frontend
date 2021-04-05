import React from 'react'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import RulesCard from './RulesCard'
import FAQs from './FAQs'

const Wrapper = styled(Flex)`
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: flex-start;
  }
`

const StyledCardWrapper = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 40px;
    flex: 1;
  }
`

const Rules = () => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <StyledCardWrapper>
        <RulesCard title={TranslateString(999, 'Trade to increase your rank')}>
          <Text textAlign="center" fontSize="14px" color="textSubtle">
            {TranslateString(999, 'Eligible pairs: BNB/BUSD, CAKE/BNB, ETH/BNB and BTCB/BNB')}
          </Text>
        </RulesCard>
        <RulesCard title={TranslateString(999, 'Play as a team')}>
          <Text textAlign="center" fontSize="14px" color="textSubtle">
            {TranslateString(999, 'The higher your team’s rank, the better your prizes!')}
          </Text>
        </RulesCard>
      </StyledCardWrapper>
      <FAQs />
    </Wrapper>
  )
}

export default Rules
