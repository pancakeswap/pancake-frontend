import React from 'react'
import { CardHeader, Heading, Text, Flex, Image, Box } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import PoolFinishedSash from './PoolFinishedSash'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; activeBackground?: string }>`
  background: ${({ isFinished, activeBackground, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[activeBackground]};
`

const StyledCardHeader: React.FC<{
  earningTokenSymbol: string
  stakingTokenSymbol: string
  autoVault?: boolean
  isFinished?: boolean
}> = ({ earningTokenSymbol, stakingTokenSymbol, isFinished = false, autoVault = false }) => {
  const TranslateString = useI18n()
  const poolImageSrc = autoVault
    ? `cake-cakevault.svg`
    : `${earningTokenSymbol}-${stakingTokenSymbol}.svg`.toLocaleLowerCase()
  const isPromoted = earningTokenSymbol === 'CAKE'
  const activeBackground = isPromoted ? 'bubblegum' : 'cardHeader'

  return (
    <>
      <Wrapper isFinished={isFinished} activeBackground={activeBackground}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column">
            <Heading color={isFinished ? 'textDisabled' : 'body'} size="lg">
              {autoVault
                ? `${TranslateString(999, 'Auto')} ${earningTokenSymbol}`
                : `${TranslateString(318, 'Earn')} ${earningTokenSymbol}`}
            </Heading>
            <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>
              {autoVault
                ? `${TranslateString(999, 'Automatic restaking')}`
                : `${TranslateString(1070, 'Stake')} ${stakingTokenSymbol}`}
            </Text>
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
