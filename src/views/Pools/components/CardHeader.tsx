import React from 'react'
import styled from 'styled-components'
import { Image, Box, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Container = styled.div`
  background: ${({ theme }) => theme.card.cardHeaderBackground};
  border-radius: 32px 32px 0px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  height: 96px;
  justify-content: space-between;
  padding: 16px 24px;
  position: relative;
`

interface CardHeaderProps {
  title: string
  coinIconUrl: string
  tokenName: string
  stakingTokenName: string
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, coinIconUrl, tokenName, stakingTokenName }) => {
  const TranslateString = useI18n()
  return (
    <Container>
      <Box>
        <Text fontSize="24px" lineHeight={1} bold>
          {title}
        </Text>
        <Text fontSize="14px" color="textSubtle" mt="4px">
          {TranslateString(999, 'Stake')} {stakingTokenName}
        </Text>
      </Box>

      <Image src={coinIconUrl} width={64} height={64} alt={tokenName} />
    </Container>
  )
}

export default CardHeader
