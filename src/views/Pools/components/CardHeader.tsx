import React from 'react'
import styled from 'styled-components'
import { Image, Box, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Container = styled.div<{ isFinished: boolean }>`
  background: ${({ isFinished, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.card.cardHeaderBackground};
  border-radius: 32px 32px 0px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  height: 96px;
  justify-content: space-between;
  padding: 16px 24px;
  position: relative;
`

const PoolFinishedSash = styled.div`
  background-image: url('/images/pool-finished-sash.svg');
  background-position: top right;
  background-repeat: no-repeat;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

interface CardHeaderProps {
  title: string
  coinIconUrl: string
  earningTokenName: string
  stakingTokenName: string
  isFinished: boolean
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  coinIconUrl,
  earningTokenName,
  stakingTokenName,
  isFinished,
}) => {
  const TranslateString = useI18n()
  return (
    <Container isFinished={isFinished}>
      <Box>
        <Text fontSize="24px" lineHeight={1} bold color={isFinished ? 'textDisabled' : 'text'}>
          {title}
        </Text>
        <Text fontSize="14px" color={isFinished ? 'textDisabled' : 'textSubtle'} mt="4px">
          {TranslateString(999, 'Stake')} {stakingTokenName}
        </Text>
      </Box>
      <Image src={coinIconUrl} width={64} height={64} alt={earningTokenName} />
      {isFinished && <PoolFinishedSash />}
    </Container>
  )
}

export default CardHeader
