import React from 'react'
import { CardHeader, Heading, Text, Flex, Image } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean }>`
  background: ${({ isFinished, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.card.cardHeaderBackground.default};
`

const StyledCardHeader: React.FC<{
  poolImage: string
  earningTokenSymbol: string
  stakingTokenSymbol: string
  isFinished?: boolean
}> = ({ poolImage, earningTokenSymbol, stakingTokenSymbol, isFinished = false }) => {
  return (
    <Wrapper isFinished={isFinished}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={isFinished ? 'textDisabled' : 'body'} size="lg">
            Earn {earningTokenSymbol}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>Stake {stakingTokenSymbol}</Text>
        </Flex>
        <Image src={`/images/pools/${poolImage}`} alt={earningTokenSymbol} width={64} height={64} />
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
