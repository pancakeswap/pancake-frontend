import React from 'react'
import styled from 'styled-components'
import { Image } from '@pancakeswap-libs/uikit'

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
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, coinIconUrl, tokenName }) => {
  return (
    <Container>
      {title}
      <Image src={coinIconUrl} width={64} height={64} alt={tokenName} />
    </Container>
  )
}

export default CardHeader
