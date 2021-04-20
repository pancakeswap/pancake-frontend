import React from 'react'
import { CardHeader, Heading, Text, Flex, Image, Box } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import PoolFinishedSash from './PoolFinishedSash'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean }>`
  background: ${({ isFinished, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.card.cardHeaderBackground.default};
`

const StyledCardHeader: React.FC<{
  poolImageSrc: string
  earningTokenSymbol: string
  stakingTokenSymbol: string
  isFinished?: boolean
}> = ({ poolImageSrc, earningTokenSymbol, stakingTokenSymbol, isFinished = false }) => {
  return (
    <>
      <Wrapper isFinished={isFinished}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column">
            <Heading color={isFinished ? 'textDisabled' : 'body'} size="lg">
              Earn {earningTokenSymbol}
            </Heading>
            <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>Stake {stakingTokenSymbol}</Text>
          </Flex>
          <Image src={`/images/pools/${poolImageSrc}`} alt={earningTokenSymbol} width={64} height={64} />
        </Flex>
      </Wrapper>
      {isFinished && (
        <Box position="absolute" top={0} right={0}>
          <PoolFinishedSash />
        </Box>
      )}
    </>
  )
}

export default StyledCardHeader
